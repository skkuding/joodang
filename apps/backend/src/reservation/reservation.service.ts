import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { PrismaService } from 'prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const { menuIds, timeSlotId, ...rest } = createReservationDto

    const alreadyBooked = await this.prisma.reservation.findUnique({
      where: { userId_timeSlotId: { userId, timeSlotId } },
    })

    if (alreadyBooked) {
      throw new ConflictException('You have already booked this time slot')
    }

    return await this.prisma.$transaction(
      async (tx) => {
        const timeSlot = await tx.timeSlot.findUnique({
          where: { id: timeSlotId },
        })

        if (!timeSlot) {
          throw new NotFoundException('Time slot not found')
        }

        if (
          timeSlot.availableSeats < 1 ||
          timeSlot.availableSeats < rest.headcount
        ) {
          throw new UnprocessableEntityException('No available seats')
        }

        // 해당 타임슬롯 날짜(당일) 기준으로 매장 내 예약 번호 산정
        const dayStart = new Date(timeSlot.startTime)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(timeSlot.startTime)
        dayEnd.setHours(23, 59, 59, 999)

        const todayCount = await tx.reservation.count({
          where: {
            storeId: rest.storeId,
            timeSlot: {
              startTime: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
          },
        })
        const reservationNum = todayCount + 1

        const processedReservation = await tx.reservation.create({
          data: {
            ...rest,
            userId,
            timeSlotId,
            reservationNum,
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
        })

        await tx.timeSlot.update({
          where: { id: timeSlotId },
          data: {
            availableSeats: { increment: -rest.headcount },
          },
        })

        return processedReservation
      },
      { isolationLevel: 'Serializable' },
    )
  }

  async getReservations(userId: number) {
    return await this.prisma.reservation.findMany({
      where: { userId },
      include: {
        menus: true,
        timeSlot: true,
        store: true,
      },
      orderBy: { id: 'desc' },
    })
  }

  async getStoreReservations(storeId: number, userId: number) {
    const isStaff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId } },
      select: {
        role: true,
      },
    })

    if (!isStaff) {
      throw new ForbiddenException('You are not a staff of this store')
    }

    return await this.prisma.reservation.findMany({
      where: { storeId },
      include: {
        menus: true,
        timeSlot: true,
        store: {
          select: {},
        },
      },
      orderBy: { id: 'desc' },
    })
  }

  async getReservation(id: number, userId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        menus: true,
        user: true,
        store: true,
        timeSlot: true,
      },
    })
    if (!reservation) {
      throw new NotFoundException('Reservation not found')
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to access this reservation',
      )
    }

    return reservation
  }

  async removeReservation(id: number, userId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!reservation) {
      throw new NotFoundException('Reservation not found')
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to remove this reservation',
      )
    }

    const deletedReservation = await this.prisma.reservation.delete({
      where: { id },
    })

    await this.prisma.timeSlot.update({
      where: { id: deletedReservation.timeSlotId },
      data: {
        availableSeats: { increment: deletedReservation.headcount },
      },
    })

    return deletedReservation
  }

  async callReservation(id: number, userId: number) {
    const isStaff = await this.prisma.reservation.findFirst({
      where: {
        id,
        store: { staffs: { some: { userId } } },
      },
      select: { id: true },
    })

    if (!isStaff) {
      throw new ForbiddenException('You are not a staff of this store')
    }

    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: {
        isDone: true,
      },
    })

    this.eventEmitter.emit('come.to.store', {
      reservationId: reservation.id,
    })

    return reservation
  }

  async confirmReservation(id: number, userId: number) {
    const isStaff = await this.prisma.reservation.findFirst({
      where: {
        id,
        store: { staffs: { some: { userId } } },
      },
      select: { id: true },
    })

    if (!isStaff) {
      throw new ForbiddenException('You are not a staff of this store')
    }

    const reservation = await this.prisma.reservation.update({
      where: { id },
      data: {
        isConfirmed: true,
      },
    })

    this.eventEmitter.emit('reservation.confirmed', {
      reservationId: reservation.id,
    })

    return reservation
  }
}
