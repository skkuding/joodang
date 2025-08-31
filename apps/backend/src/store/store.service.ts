import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { PrismaService } from 'prisma/prisma.service'
import { GetStoresDto } from './dto/get-stores.dto'
import { Prisma } from '@prisma/client'

export type StoreSortFilter = 'popular' | 'fee' | 'seats'

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

  async createStore(createStoreDto: CreateStoreDto) {
    const { timeSlots, ...storeData } = createStoreDto

    return await this.prisma.store.create({
      data: {
        ...storeData,
        timeSlots: {
          create: timeSlots.map((timeslot) => ({
            ...timeslot,
            availableSeats: timeslot.totalCapacity,
          })),
        },
      },
    })
  }

  async updateStore(id: number, updateStoreDto: UpdateStoreDto) {
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

      const updated = await tx.store.update({
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

      return updated
    })

    return result
  }

  async removeStore(id: number) {
    const existing = await this.prisma.store.findUnique({ where: { id } })
    if (!existing) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.')
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.reservation.deleteMany({ where: { storeId: id } })

      const deleted = await tx.store.delete({
        where: { id },
      })

      return deleted
    })

    return result
  }
}
