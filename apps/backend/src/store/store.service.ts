import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'prisma/prisma.service';
import { GetStoresDto } from './dto/get-stores.dto';
import { Prisma, Role } from '@prisma/client';
import { AddStaffDto } from './dto/add-staff.dto';

export type StoreSortFilter = 'popular' | 'fee' | 'seats';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

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

  async addStaff(
    userId: number,
    id: number, 
    addStaffDto: AddStaffDto
  ) {
    const staffInfo = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId: id } },
    })
    if (!staffInfo || staffInfo.role !== Role.OWNER) {
      throw new ForbiddenException('스탭을 추가할 권한이 없습니다.')
    }

    if (!staffInfo || staffInfo.role !== Role.OWNER) {
      throw new ForbiddenException('스탭을 추가할 권한이 없습니다.');
    }

    const userToAdd = await this.prisma.user.findUnique({
      where: { kakaoId: addStaffDto.kakaoId },
    })
    if (!userToAdd) {
      throw new NotFoundException(
        `카카오 아이디 '${addStaffDto.kakaoId}'에 해당하는 유저를 찾을 수 없습니다.`,
      )
    }
    
    const existingStaff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId: userToAdd.id, storeId: id } },
    })
    if (existingStaff) {
      throw new ConflictException('이미 해당 가게의 스탭 또는 소유자입니다.');
    }

    return this.prisma.storeStaff.create({
      data: { storeId: id, userId: userToAdd.id, role: Role.STAFF },
    })
  }
}
