import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'prisma/prisma.service';
// Remove the following line to avoid type conflicts
// import { Prisma } from 'generated/prisma';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getStores() {
    return await this.prisma.store.findMany();
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
