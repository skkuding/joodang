import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import {
  CreateReservationDto,
  CreateWalkInReservationDto,
} from './dto/create-reservation.dto'
import { PrismaService } from 'prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { randomBytes } from 'crypto'
import { TokensDto } from './dto/token.dto'

@Injectable()
export class ReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Return KST day range (as UTC Date objects) for the given base date
  private getKstDayRange(base: Date) {
    const KST_OFFSET_MS = 9 * 60 * 60 * 1000 // UTC+9
    const baseKst = new Date(base.getTime() + KST_OFFSET_MS)
    const startKst = new Date(baseKst)
    startKst.setHours(0, 0, 0, 0)
    const endKst = new Date(baseKst)
    endKst.setHours(23, 59, 59, 999)
    // convert back to UTC
    const startUtc = new Date(startKst.getTime() - KST_OFFSET_MS)
    const endUtc = new Date(endKst.getTime() - KST_OFFSET_MS)
    return { startUtc, endUtc }
  }

  private generateReservationToken(): string {
    return randomBytes(32).toString('hex')
  }

  private async generateUniqueReservationToken(): Promise<string> {
    let token = this.generateReservationToken()
    let isUnique = false

    while (!isUnique) {
      const existingReservation = await this.prisma.reservation.findUnique({
        where: { token },
        select: { id: true },
      })
      if (existingReservation) {
        token = this.generateReservationToken()
      } else {
        isUnique = true
      }
    }

    return token
  }

  async createReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const { menuIds, timeSlotId, ...rest } = createReservationDto

    const alreadyBooked = await this.prisma.reservation.findUnique({
      where: { userId_timeSlotId: { userId, timeSlotId } },
      select: { isConfirmed: true },
    })

    if (alreadyBooked && alreadyBooked.isConfirmed !== false) {
      throw new ConflictException('You have already booked this time slot')
    }

    const reservationCreated = await this.prisma.$transaction(
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

        // 해당 타임슬롯 날짜(당일) 기준(KST)으로 매장 내 예약 번호 산정
        const { startUtc: dayStart, endUtc: dayEnd } = this.getKstDayRange(
          new Date(timeSlot.startTime),
        )

        const todayMax = await tx.reservation.aggregate({
          where: {
            storeId: createReservationDto.storeId,
            timeSlot: {
              startTime: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
          },
          _max: {
            reservationNum: true,
          },
        })
        const reservationNum = (todayMax._max.reservationNum ?? 0) + 1

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

    this.eventEmitter.emit('reservation.created', {
      reservationId: reservationCreated.id,
      startTime: reservationCreated.timeSlot.startTime,
    })

    return reservationCreated
  }

  async createWalkInReservation(
    createWalkInReservationDto: CreateWalkInReservationDto,
    userId?: number,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id: createWalkInReservationDto.storeId },
      select: { startTime: true, endTime: true },
    })
    if (!store) {
      throw new NotFoundException('Store not found')
    }

    const now = new Date()
    if (now < store.startTime || now > store.endTime) {
      throw new UnprocessableEntityException(
        'This is not a store opening time. Walk-In not available.',
      )
    }

    const { startUtc: dayStart, endUtc: dayEnd } = this.getKstDayRange(now)
    let token: string | undefined = undefined

    if (userId) {
      const alreadyBooked = await this.prisma.reservation.findFirst({
        where: {
          storeId: createWalkInReservationDto.storeId,
          timeSlot: {
            totalCapacity: -1,
            availableSeats: 0,
          },
          userId,
        },
        select: { isConfirmed: true },
      })

      if (alreadyBooked && alreadyBooked.isConfirmed !== false) {
        throw new ConflictException(
          'You have already made a walk-in reservation for this store',
        )
      }
    } else {
      const alreadyBooked = await this.prisma.reservation.findFirst({
        where: {
          storeId: createWalkInReservationDto.storeId,
          timeSlot: {
            totalCapacity: -1,
            availableSeats: 0,
          },
          token: {
            in: createWalkInReservationDto.tokens ?? [],
          },
        },
        select: { isConfirmed: true },
      })

      if (alreadyBooked && alreadyBooked.isConfirmed !== false) {
        throw new ConflictException(
          'You have already made a walk-in reservation for this store',
        )
      }
      token = await this.generateUniqueReservationToken()
    }

    const createdReservation = await this.prisma.$transaction(async (tx) => {
      // 해당 타임슬롯 날짜(당일) 기준으로 매장 내 예약 번호 산정
      const todayMax = await tx.reservation.aggregate({
        where: {
          storeId: createWalkInReservationDto.storeId,
          timeSlot: {
            startTime: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        },
        _max: {
          reservationNum: true,
        },
      })
      const reservationNum = (todayMax._max.reservationNum ?? 0) + 1

      const timeSlotExist = await tx.timeSlot.findFirst({
        where: {
          storeId: createWalkInReservationDto.storeId,
          totalCapacity: -1,
          availableSeats: 0,
          startTime: dayStart,
        },
        select: {
          id: true,
        },
      })

      let timeSlotCreated
      if (!timeSlotExist) {
        timeSlotCreated = await tx.timeSlot.create({
          data: {
            storeId: createWalkInReservationDto.storeId,
            startTime: dayStart,
            endTime: dayEnd,
            totalCapacity: -1,
            availableSeats: 0,
          },
        })
      }

      const { menuIds, tokens, ...rest } = createWalkInReservationDto

      const reservation = await tx.reservation.create({
        data: {
          ...rest,
          userId,
          timeSlotId: timeSlotExist ? timeSlotExist.id : timeSlotCreated.id,
          reservationNum,
          token,
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

      return reservation
    })

    this.eventEmitter.emit('reservation.created', {
      reservationId: createdReservation.id,
      startTime: null,
    })

    return createdReservation
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

  async getStoreReservations({
    storeId,
    userId,
    isConfirmed,
    toBeConfirmed,
    isWalkIn,
  }: {
    storeId: number
    userId: number
    isConfirmed?: boolean | null
    toBeConfirmed?: boolean
    isWalkIn?: boolean
  }) {
    const isStaff = await this.prisma.storeStaff.findUnique({
      where: { userId_storeId: { userId, storeId } },
      select: {
        role: true,
      },
    })

    if (!isStaff) {
      throw new ForbiddenException('You are not a staff of this store')
    }

    const reservations = await this.prisma.reservation.findMany({
      where: {
        storeId,
        ...(toBeConfirmed === undefined
          ? { isConfirmed }
          : toBeConfirmed
            ? { isConfirmed: null }
            : { isConfirmed: { not: null, equals: isConfirmed } }), // not null + 값 일치
        ...(isWalkIn === undefined
          ? {} // 조건 없음
          : isWalkIn
            ? { timeSlot: { totalCapacity: -1 } } // walk-in
            : { NOT: { timeSlot: { totalCapacity: -1 } } }), // walk-in이 아님
      },
      include: {
        menus: true,
        timeSlot: true,
      },
      orderBy: [{ timeSlot: { startTime: 'asc' } }, { id: 'asc' }],
    })

    return reservations
  }

  async getReservation(id: number, userId?: number, tokens?: string[]) {
    if (tokens && !Array.isArray(tokens)) {
      tokens = [tokens]
    }
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        menus: true,
        user: true,
        store: {
          include: {
            staffs: true,
          },
        },
        timeSlot: true,
      },
    })
    if (!reservation) {
      throw new NotFoundException('Reservation not found')
    }

    const staffIds = reservation.store.staffs.map((staff) => staff.userId)

    if (userId && reservation.userId !== userId && !staffIds.includes(userId)) {
      throw new ForbiddenException(
        'You are not allowed to access this reservation',
      )
    }

    if (
      !userId &&
      (!reservation.token || !tokens?.includes(reservation.token))
    ) {
      throw new ForbiddenException(
        'You are not allowed to access this reservation',
      )
    }

    const isWalkIn =
      reservation.timeSlot.totalCapacity === -1 &&
      reservation.timeSlot.availableSeats === 0
    if (!isWalkIn) {
      return reservation
    }

    // walk-in 예약인 경우, 대기 인원 산정
    const { startUtc: dayStart, endUtc: dayEnd } = this.getKstDayRange(
      new Date(),
    )

    const waitingOrder = await this.prisma.reservation.count({
      where: {
        storeId: reservation.storeId,
        isDone: false,
        id: {
          lt: reservation.id,
        },
        timeSlot: {
          totalCapacity: -1,
          startTime: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      },
    })

    return { ...reservation, waitingOrder }
  }

  async getReservationWithTokens(tokens: string[] | string) {
    if (!Array.isArray(tokens)) {
      tokens = [tokens]
    }

    const reservations = await this.prisma.reservation.findMany({
      where: {
        token: {
          in: tokens,
        },
      },
      include: {
        menus: true,
        store: true,
        timeSlot: true,
      },
    })

    if (reservations.length === 0) {
      throw new NotFoundException('Reservation Not Found')
    }

    return reservations
  }

  async removeReservation(id: number, userId?: number, tokensDto?: TokensDto) {
    const tokens = tokensDto?.tokens
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      select: { userId: true, token: true, isConfirmed: true },
    })

    if (!reservation) {
      throw new NotFoundException('Reservation not found')
    }

    if (userId && reservation.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to remove this reservation',
      )
    }

    if (
      !userId &&
      (!reservation.token || !tokens?.includes(reservation.token))
    ) {
      throw new ForbiddenException(
        'You are not allowed to remove this reservation',
      )
    }

    if (reservation.isConfirmed) {
      throw new ConflictException("You can't delete confirmed reservation")
    }

    const deletedReservation = await this.prisma.reservation.delete({
      where: { id },
    })

    await this.prisma.timeSlot.updateMany({
      where: {
        id: deletedReservation.timeSlotId,
        totalCapacity: {
          not: -1,
        },
      },
      data: {
        availableSeats: { increment: deletedReservation.headcount },
      },
    })

    this.eventEmitter.emit('reservation.canceled', {
      reservationId: deletedReservation.id,
      storeId: deletedReservation.storeId,
    })

    return deletedReservation
  }

  async callReservation(id: number, userId: number) {
    const isStaff = await this.prisma.reservation.findFirst({
      where: {
        id,
        store: { staffs: { some: { userId } } },
      },
      select: { id: true, userId: true, token: true },
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

    const pushSubscription = await this.prisma.pushSubscription.findFirst({
      where: {
        OR: [{ userId: isStaff.userId ?? undefined }, { token: isStaff.token }],
      },
    })

    if (!pushSubscription) {
      throw new ConflictException('User has no push subscription')
    }

    this.eventEmitter.emit('come.to.store', {
      reservationId: reservation.id,
    })

    return reservation
  }

  async confirmReservation(id: number, userId: number, isConfirm: boolean) {
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
        isConfirmed: isConfirm,
        isDone: !isConfirm,
      },
    })

    if (!isConfirm) {
      await this.prisma.timeSlot.update({
        where: { id: reservation.timeSlotId },
        data: {
          availableSeats: { increment: reservation.headcount },
        },
      })
    }

    this.eventEmitter.emit(
      isConfirm ? 'reservation.confirmed' : 'reservation.declined',
      {
        reservationId: reservation.id,
      },
    )

    return reservation
  }

  async addMyReservationWithToken(tokensDto: TokensDto, userId: number) {
    if (!tokensDto) {
      throw new BadRequestException('Please provide tokens')
    }
    // 1) 토큰으로 매칭되는 후보 예약 조회
    const candidates = await this.prisma.reservation.findMany({
      where: {
        token: {
          in: tokensDto.tokens,
        },
      },
      select: {
        id: true,
        timeSlotId: true,
        headcount: true,
        storeId: true,
        timeSlot: {
          select: { totalCapacity: true },
        },
      },
    })

    if (candidates.length === 0) {
      return { count: 0 }
    }

    // 2) 사용자(userId)가 이미 가진 같은 timeSlot 예약 유무 조회
    const timeSlotIds = Array.from(new Set(candidates.map((c) => c.timeSlotId)))
    const existingOfUser = await this.prisma.reservation.findMany({
      where: {
        userId,
        timeSlotId: { in: timeSlotIds },
      },
      select: { id: true, timeSlotId: true },
    })
    const userHasForSlot = new Set(existingOfUser.map((r) => r.timeSlotId))

    // 3) 슬롯별 그룹핑해서 보존/삭제 대상을 결정
    const bySlot = new Map<number, typeof candidates>()
    for (const c of candidates) {
      const arr = bySlot.get(c.timeSlotId) ?? []
      arr.push(c)
      bySlot.set(c.timeSlotId, arr)
    }

    const toDeleteIds: number[] = []
    const toKeepIds: number[] = []

    for (const [slotId, list] of bySlot.entries()) {
      if (userHasForSlot.has(slotId)) {
        // 이미 해당 슬롯의 예약이 있으므로, 이번 토큰 기반 예약들은 모두 삭제 대상
        toDeleteIds.push(...list.map((x) => x.id))
        continue
      }
      // 동일 슬롯에서 여러 건이면 1건만 허용, 나머지는 삭제
      const sorted = [...list].sort((a, b) => a.id - b.id)
      toKeepIds.push(sorted[0].id)
      toDeleteIds.push(...sorted.slice(1).map((x) => x.id))
    }

    // 4) 트랜잭션으로 좌석 복원(필요 시) 후 삭제, 그리고 안전한 예약만 updateMany
    const result = await this.prisma.$transaction(async (tx) => {
      if (toDeleteIds.length > 0) {
        // 좌석 복원: walk-in이 아닌 경우만 해당 (totalCapacity !== -1)
        const deleting = candidates.filter((c) => toDeleteIds.includes(c.id))
        const seatRestoreMap = new Map<number, number>() // timeSlotId -> incrementSum
        for (const d of deleting) {
          if (d.timeSlot.totalCapacity !== -1) {
            seatRestoreMap.set(
              d.timeSlotId,
              (seatRestoreMap.get(d.timeSlotId) ?? 0) + d.headcount,
            )
          }
        }
        for (const [slotId, inc] of seatRestoreMap.entries()) {
          await tx.timeSlot.update({
            where: { id: slotId },
            data: { availableSeats: { increment: inc } },
          })
        }
        await tx.reservation.deleteMany({ where: { id: { in: toDeleteIds } } })
      }

      if (toKeepIds.length === 0) {
        return { count: 0 }
      }

      return await tx.reservation.updateMany({
        where: { id: { in: toKeepIds } },
        data: { userId, token: null },
      })
    })

    const pushSubscription = await this.prisma.pushSubscription.findFirst({
      where: {
        token: {
          in: tokensDto.tokens,
        },
      },
    })

    if (pushSubscription?.token) {
      try {
        await this.prisma.pushSubscription.update({
          where: {
            token: pushSubscription.token,
          },
          data: {
            userId,
            token: null,
          },
        })
      } catch {}
    }

    await this.prisma.pushSubscription.deleteMany({
      where: {
        token: {
          in: tokensDto.tokens,
        },
      },
    })

    return result
  }
}
