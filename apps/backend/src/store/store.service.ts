import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'prisma/prisma.service';

export type StoreSortFilter = 'popular' | 'fee' | 'seats';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 정렬 필터에 따라 가게 목록을 조회합니다.
   * @param filter 'popular', 'fee', 'seats'
   */
  async getStores(filter?: StoreSortFilter) {
    const now = new Date()

    if (!filter) {
      return await this.prisma.store.findMany({
        where: { 
          endTime: { gte: now } 
        },
        orderBy: { 
          id: 'asc' 
        }
      })
    }

    switch (filter) {
      case 'popular': {
        const popularStoresData = await this.prisma.reservation.groupBy({
          by: ['storeId'],
          _count: {
            id: true
          },
          having: {
            id: {
              _count: {
                gte: 5 // 최소 예약 수 (추후 초기 기획인 40으로 수정)
              }
            }
          }
        })
        
        popularStoresData.sort((a, b) => {
          if (b._count.id !== a._count.id) return b._count.id - a._count.id
          return a.storeId - b.storeId
        })

        const sortedStoreIds = popularStoresData.map(data => data.storeId)
        if (sortedStoreIds.length === 0) return []

        const popularStores = await this.prisma.store.findMany({
          where: {
            id: { in: sortedStoreIds },
            endTime: { gte: now }
          }
        })
        
        return sortedStoreIds
          .map(id => popularStores.find(store => store.id === id))
          .filter(Boolean)
      }

      case 'fee': {
        return await this.prisma.store.findMany({
          orderBy: [{ reservationFee: 'asc' }, { id: 'asc' }]
        })
      }

      case 'seats': {
        const stores = await this.prisma.store.findMany({
          include: {
            timeSlots: {
              where: { startTime: { gte: new Date() } },
              select: { availableSeats: true },
            },
          },
        });
        stores.sort((a, b) => {
          const totalSeatsA = a.timeSlots.reduce((sum, slot) => sum + slot.availableSeats, 0);
          const totalSeatsB = b.timeSlots.reduce((sum, slot) => sum + slot.availableSeats, 0);
          if (totalSeatsB !== totalSeatsA) return totalSeatsB - totalSeatsA;
          return a.id - b.id;
        });
        return stores.map(store => {
            const { timeSlots, ...storeData } = store;
            return storeData;
        });
      }
    }
  }

  async getStore(id: number) {
    return await this.prisma.store.findUniqueOrThrow({ where: { id } });
  }

  async createStore(createStoreDto: CreateStoreDto) {
    const { startTime, endTime, ...restData } = createStoreDto

    const newStore = await this.prisma.store.create({
      data: {
        ...restData,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    })
    return newStore
  }

  async updateStore(id: number, updateStoreDto: UpdateStoreDto) {
    const existingStore = await this.prisma.store.findUnique({
      where: { id },
    })

    if (!existingStore) {
      throw new NotFoundException('해당 가게를 찾을 수 없습니다.');
    }
    const { startTime, endTime, ...restData } = updateStoreDto;
    const dataToUpdate = { ...restData };

    if (startTime) {
      (dataToUpdate as any).startTime = new Date(startTime);
    }
    if (endTime) {
      (dataToUpdate as any).endTime = new Date(endTime);
    }

    return await this.prisma.store.update({
      where: { id },
      data: dataToUpdate,
    })
  }

  async removeStore(id: number) {
    return await this.prisma.store.delete({ where: { id } })
  }
}
