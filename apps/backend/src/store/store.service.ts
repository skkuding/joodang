import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { nanoid } from 'nanoid'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { PrismaService } from '@prisma/prisma.service'
import { GetStoresDto } from './dto/get-stores.dto'
import { Prisma, Role } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { UploadStoreImageDto } from './dto/upload-store-image.dto'

export type StoreSortFilter = 'popular' | 'fee' | 'seats'

@Injectable()
export class StoreService {
  private s3: S3Client
  private bucket: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get<string>('S3_BUCKET')!
    this.s3 = new S3Client({
      endpoint: this.config.get<string>('S3_ENDPOINT'),
      region: this.config.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!,
      },
      forcePathStyle: this.config.get<string>('S3_FORCE_PATH_STYLE') === 'true',
    })
  }

  /**
   * 정렬 필터에 따라 가게 목록을 조회합니다.
   * @param sort 'popular', 'fee', 'seats'
   */
  async getStores(dto: GetStoresDto) {
    const { sort, minFee, maxFee, startTime, endTime } = dto
    const where: Prisma.StoreWhereInput = {
      endTime: { gte: new Date() },
    }

    if (minFee !== undefined || maxFee !== undefined) {
      where.reservationFee = {}
      if (minFee !== undefined) where.reservationFee.gte = minFee
      if (maxFee !== undefined) where.reservationFee.lte = maxFee
    }

    if (startTime && endTime) {
      where.timeSlots = {
        some: {
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      }
    }

    switch (sort) {
      case 'popular': {
        const popularStoresData = await this.prisma.reservation.groupBy({
          by: ['storeId'],
          _count: {
            id: true,
          },
          having: {
            id: {
              _count: {
                gte: 5, // 최소 예약 수 (추후 초기 기획인 40으로 수정)
              },
            },
          },
        })

        popularStoresData.sort((a, b) => {
          if (b._count.id !== a._count.id) return b._count.id - a._count.id
          return a.storeId - b.storeId
        })

        const sortedStoreIds = popularStoresData.map((data) => data.storeId)
        if (sortedStoreIds.length === 0) return []

        const popularStores = await this.prisma.store.findMany({
          where: {
            id: { in: sortedStoreIds },
            ...where,
          },
        })

        return sortedStoreIds
          .map((id) => popularStores.find((store) => store.id === id))
          .filter(Boolean)
      }

      case 'fee': {
        return await this.prisma.store.findMany({
          where,
          orderBy: [{ reservationFee: 'asc' }, { id: 'asc' }],
        })
      }

      case 'seats': {
        const stores = await this.prisma.store.findMany({
          where,
          include: {
            timeSlots: {
              where: { startTime: { gte: new Date() } },
              select: { availableSeats: true },
            },
          },
        })
        stores.sort((a, b) => {
          const totalSeatsA = a.timeSlots.reduce(
            (sum, slot) => sum + slot.availableSeats,
            0,
          )
          const totalSeatsB = b.timeSlots.reduce(
            (sum, slot) => sum + slot.availableSeats,
            0,
          )
          if (totalSeatsB !== totalSeatsA) return totalSeatsB - totalSeatsA
          return a.id - b.id
        })
        return stores.map((store) => {
          const { timeSlots, ...storeData } = store
          return storeData
        })
      }

      default: {
        return await this.prisma.store.findMany({
          where,
          orderBy: { id: 'asc' },
        })
      }
    }
  }

  async getStore(id: number) {
    const store = await this.prisma.store.findUniqueOrThrow({
      where: { id },
      include: {
        menus: true,
        timeSlots: {
          select: {
            startTime: true,
            endTime: true,
            availableSeats: true,
          },
          orderBy: { startTime: 'asc' },
        },
      },
    })

    const now = new Date()
    const currentTimeSlot =
      store.timeSlots.find(
        (timeslot) => timeslot.startTime <= now && timeslot.endTime > now,
      ) ?? null

    return {
      ...store,
      currentAvailableSeats: currentTimeSlot?.availableSeats ?? null,
    }
  }

  async createStore(userId: number, createStoreDto: CreateStoreDto) {
    const { timeSlots, ...storeData } = createStoreDto

    if (!timeSlots || timeSlots.length === 0) {
      throw new Error('At least one timeslot is required.')
    }

    const storeOperatingHours = timeSlots.reduce(
      (acc, slot) => {
        const earliestStartTime =
          acc.startTime < slot.startTime ? acc.startTime : slot.startTime
        const latestEndTime =
          acc.endTime > slot.endTime ? acc.endTime : slot.endTime

        return { startTime: earliestStartTime, endTime: latestEndTime }
      },
      { startTime: timeSlots[0].startTime, endTime: timeSlots[0].endTime },
    )

    return await this.prisma.$transaction(async (tx) => {
      const newStore = await tx.store.create({
        data: {
          ...storeData,
          ownerId: userId,
          startTime: storeOperatingHours.startTime,
          endTime: storeOperatingHours.endTime,
          timeSlots: {
            create: timeSlots.map((timeslot) => ({
              ...timeslot,
              totalCapacity: createStoreDto.totalCapacity,
              availableSeats: createStoreDto.totalCapacity,
            })),
          },
          staffs: {
            create: {
              userId: userId,
              role: Role.OWNER,
            },
          },
        },
      })

      await tx.user.update({
        where: {
          id: userId,
          role: { not: Role.ADMIN },
        },
        data: {
          role: Role.OWNER,
        },
      })

      return newStore
    })
  }

  async updateStore(
    userId: number,
    id: number,
    updateStoreDto: UpdateStoreDto,
  ) {
    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: id } },
    })
    if (!staffInfo) {
      throw new ForbiddenException('가게를 수정할 권한이 없습니다.')
    }

    const existingStore = await this.prisma.store.findUnique({
      where: { id },
    })
    if (!existingStore) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.')
    }

    const { timeSlots, ...storeData } = updateStoreDto
    let operatingHoursData = {}
    if (timeSlots && timeSlots.length > 0) {
      const storeOperatingHours = timeSlots.reduce(
        (acc, slot) => {
          const earliestStartTime =
            acc.startTime < slot.startTime ? acc.startTime : slot.startTime
          const latestEndTime =
            acc.endTime > slot.endTime ? acc.endTime : slot.endTime
          return { startTime: earliestStartTime, endTime: latestEndTime }
        },
        { startTime: timeSlots[0].startTime, endTime: timeSlots[0].endTime },
      )
      operatingHoursData = {
        startTime: storeOperatingHours.startTime,
        endTime: storeOperatingHours.endTime,
      }
    }

    return await this.prisma.store.update({
      where: { id },
      data: {
        ...storeData,
        ...operatingHoursData,
        timeSlots: timeSlots
          ? {
              deleteMany: {},
              create: timeSlots.map((timeslot) => ({
                ...timeslot,
                totalCapacity:
                  storeData.totalCapacity ?? existingStore.totalCapacity,
                availableSeats:
                  storeData.totalCapacity ?? existingStore.totalCapacity,
              })),
            }
          : undefined,
      },
    })
  }

  async removeStore(userId: number, id: number) {
    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: id } },
    })
    if (!staffInfo || staffInfo.role !== Role.OWNER) {
      throw new ForbiddenException('가게를 삭제할 권한이 없습니다.')
    }

    const existing = await this.prisma.store.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.')
    }

    const deletedStore = await this.prisma.store.delete({ where: { id } })

    await this.updateUserRoleAfterRemove(userId)

    try {
      await this.deleteStoreAssetsPrefix(id)
    } catch (err) {
      console.warn('[S3] Failed to delete store assets prefix', {
        storeId: id,
        error: (err as Error)?.message,
      })
    }

    return deletedStore
  }

  private async deleteStoreAssetsPrefix(storeId: number) {
    const prefix = `public/store/${storeId}/`
    let continuationToken: string | undefined
    do {
      const resp = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      )
      const toDelete = (resp.Contents ?? [])
        .filter((o) => !!o.Key)
        .map((o) => ({ Key: o.Key! }))
      if (toDelete.length) {
        await this.s3.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: { Objects: toDelete, Quiet: true },
          }),
        )
      }
      continuationToken = resp.IsTruncated
        ? resp.NextContinuationToken
        : undefined
    } while (continuationToken)
  }

  async createStaffInvitation(ownerId: number, storeId: number) {
    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId: ownerId, storeId } },
    })
    if (!staffInfo || staffInfo.role !== Role.OWNER) {
      throw new ForbiddenException('스태프를 초대할 권한이 없습니다.')
    }

    const inviteCode: string = nanoid(6) // 6자리 초대 코드
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후 만료

    await this.prisma.staffInvitation.create({
      data: {
        code: inviteCode,
        storeId: storeId,
        expiresAt: expiresAt,
      },
    })

    const frontendBase =
      this.config.get<string>('FRONTEND_BASE_URL') || 'http://localhost:3000'
    const url = new URL('/staff/invitation', frontendBase)
    url.searchParams.set('code', inviteCode)
    const invitationLink = url.toString()

    return {
      message: '초대 링크가 생성되었습니다. 24시간 안에 수락해야 합니다.',
      invitationLink,
      inviteCode,
      expiresAt,
    }
  }

  async acceptStaffInvitation(userId: number, code: string) {
    const invitation = await this.prisma.staffInvitation.findUnique({
      where: { code },
    })
    if (!invitation) {
      throw new NotFoundException('유효하지 않은 초대 코드입니다.')
    }

    if (new Date() > invitation.expiresAt) {
      await this.prisma.staffInvitation.delete({ where: { id: invitation.id } })
      throw new GoneException('초대 코드가 만료되었습니다.')
    }

    const { storeId } = invitation

    const existingStaff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId } },
    })
    if (existingStaff) {
      throw new ConflictException('이미 해당 가게의 스태프입니다.')
    }

    return await this.prisma.$transaction(async (tx) => {
      const newStoreStaff = await tx.storeStaff.create({
        data: {
          userId: userId,
          storeId: storeId,
          role: Role.STAFF,
        },
      })

      await tx.user.update({
        where: {
          id: userId,
          role: { not: Role.ADMIN },
        },
        data: {
          role: Role.STAFF,
        },
      })

      return newStoreStaff
    })
  }

  async removeStaff(ownerId: number, storeId: number, userId: number) {
    const ownerInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId: ownerId, storeId } },
    })
    if (!ownerInfo || ownerInfo.role !== Role.OWNER) {
      throw new ForbiddenException('스태프를 삭제할 권한이 없습니다.')
    }
    if (ownerId === userId) {
      throw new ForbiddenException(
        '본인을 스스로를 스태프에서 삭제할 수 없습니다. 주점 삭제 기능을 이용해주세요.',
      )
    }

    const storeStaffToRemove = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId } },
    })
    if (!storeStaffToRemove) {
      throw new NotFoundException('주점에서 해당 스태프를 찾을 수 없습니다.')
    }

    const deletedStaff = await this.prisma.storeStaff.delete({
      where: { userId_storeId: { userId, storeId } },
    })

    await this.updateUserRoleAfterRemove(userId)

    return deletedStaff
  }

  /**
   * User의 Store 관련 role(OWNER, STAFF)이 변경되었을 때, User 모델의 role을 재조정합니다.
   * ADMIN 유저라면 role을 변경하지 않습니다.
   * @param userId 역할을 재조정할 유저의 ID
   */
  private async updateUserRoleAfterRemove(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!user || user.role === Role.ADMIN) {
      return
    }

    const remainingStaffRoles = await this.prisma.storeStaff.findMany({
      where: { userId },
    })

    let newRole: Role = Role.USER
    console.log(remainingStaffRoles + "+++" + remainingStaffRoles.length)
    if (remainingStaffRoles.length > 0) {
      if (remainingStaffRoles.some((r) => r.role === Role.OWNER)) {
        newRole = Role.OWNER
      } else {
        newRole = Role.STAFF
      }
    }

    if (user.role !== newRole) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      })
    }
  }

  /**
   * 이미지 업로드용 Presigned POST 생성
   */
  async createStoreImagePresign(
    userId: number,
    storeId: number,
    uploadStoreImageDto: UploadStoreImageDto,
  ) {
    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId } },
      select: { id: true },
    })

    if (!staffInfo) {
      throw new ForbiddenException('가게에 대한 업로드 권한이 없습니다.')
    }

    const { fileIdx, contentType } = uploadStoreImageDto

    const extensionMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/heic': 'heic',
      'image/heif': 'heif',
      'image/webp': 'webp',
    }
    const ext = extensionMap[contentType]
    if (!ext) {
      throw new Error('Invalid image content-type')
    }

    const safePostfix = fileIdx.replace(/[^a-zA-Z0-9-_]/g, '-')
    const key = `public/store/${storeId}/${safePostfix}.${ext}`

    const maxSize = 5 * 1024 * 1024

    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, maxSize],
        ['starts-with', '$Content-Type', 'image/'],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 60, // 초
    })

    return {
      url,
      fields,
      key,
      publicUrl: `${this.config.get('S3_PUBLIC_BASE') || this.config.get('S3_ENDPOINT')}/${this.bucket}/${key}`,
      maxSize,
      contentType,
    }
  }
}
