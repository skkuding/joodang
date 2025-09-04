import { ConflictException, ForbiddenException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config'
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'prisma/prisma.service';
import { GetStoresDto } from './dto/get-stores.dto';
import { Prisma, Role } from '@prisma/client';

export type StoreSortFilter = 'popular' | 'fee' | 'seats';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

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

  async createStore(
    userId: number, 
    createStoreDto: CreateStoreDto
  ) {
    const { timeSlots, ...storeData } = createStoreDto

    return await this.prisma.store.create({
      data: {
        ...storeData,
        ownerId: userId,
        timeSlots: {
          create: timeSlots.map((timeslot) => ({
            ...timeslot,
            availableSeats: timeslot.totalCapacity,
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
  }

  async updateStore(
    userId: number,
    id: number, 
    updateStoreDto: UpdateStoreDto
  ) {
    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: id } },
    })
    if (!staffInfo) {
      throw new ForbiddenException('가게를 수정할 권한이 없습니다.');
    }

    const existingStore = await this.prisma.store.findUnique({
      where: { id },
    })
    if (!existingStore) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.')
    }

    const { timeSlots, ...rest } = updateStoreDto
    const partialData = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    ) as Prisma.StoreUpdateInput
    if (!timeSlots) {
      return await this.prisma.store.update({
        where: { id },
        data: partialData,
        include: { timeSlots: true },
      })
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.timeSlot.deleteMany({ where: { storeId: id } })

      return await tx.store.update({
        where: { id },
        data: {
          ...partialData,
          timeSlots: {
            create: timeSlots.map((timeslot) => ({
              ...timeslot,
              availableSeats: timeslot.totalCapacity,
            })),
          },
        },
        include: { timeSlots: true },
      })
    })

    return result
  }

  async removeStore(
    userId: number,
    id: number,
  ) {
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

    return await this.prisma.store.delete({ where: { id } })
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
    
    const frontendBase = this.config.get<string>('FRONTEND_BASE_URL') || 'http://localhost:3000'
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
      await this.prisma.staffInvitation.delete({ where: { id: invitation.id } })
      throw new ConflictException('이미 해당 가게의 스태프입니다.')
    }

    return this.prisma.storeStaff.create({
      data: {
        userId: userId,
        storeId: storeId,
        role: Role.STAFF,
      },
    })
  }
}
