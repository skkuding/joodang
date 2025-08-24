import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createReservation(createReservationDto: CreateReservationDto) {
    const { menuIds, timeSlotId, ...rest } = createReservationDto;
    
    const timeSlot = await this.prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if((timeSlot?.availableSeats ?? 0 < 1) || (timeSlot?.availableSeats ?? 0 < rest.headcount)) {
      throw new UnprocessableEntityException('No available seats');
    }

    const processedReservation =  await this.prisma.reservation.create({
      data: {
        ...rest,
        timeSlotId,
        ...(menuIds?.length
          ? { menus: { connect: menuIds.map((id) => ({ id })) } }
          : {}),
      },
      include: {
        menus: true,
        user: true,
        store: true,
        timeSlot: true,
      },
    });

    await this.prisma.timeSlot.update({
      where:{ id: timeSlotId},
      data:{
        availableSeats: { increment: -rest.headcount }
      }
    })

    return processedReservation
  }

  async getReservations(userId: number) {
    return await this.prisma.reservation.findMany({
      where: { userId },
      include: {
        menus: true,
        timeSlot: true,
        store: true
      },
      orderBy: { id: 'desc' },
    });
  }

  async getStoreReservations(storeId: number){
    return await this.prisma.reservation.findMany({
      where: { storeId },
      include: {
        menus: true,
        timeSlot: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async getReservation(id: number) {
    return await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        menus: true,
        user: true,
        store: true,
        timeSlot: true,
      },
    });
  }

  async removeReservation(id: number) {
    const deletedReservation = await this.prisma.reservation.delete({ where: { id } });

    await this.prisma.timeSlot.update({
      where: { id: deletedReservation.timeSlotId },
      data: {
        availableSeats: { increment: deletedReservation.headcount },
      },
    });

    return deletedReservation;
  }

  async callReservation(id: number) {
    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: {
        isDone: true
      }
    })

    this.eventEmitter.emit('come.to.store', {
      reservationId: reservation.id
    })

    return reservation
  }
}
