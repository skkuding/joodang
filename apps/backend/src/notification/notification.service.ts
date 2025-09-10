import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as webpush from 'web-push'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto'
import { Role } from '@prisma/client'
import { JobService } from '@app/job/job.service'

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jobService: JobService,
  ) {
    const vapidKeys = {
      publicKey: this.config.get('VAPID_PUBLIC_KEY'),
      privateKey: this.config.get('VAPID_PRIVATE_KEY'),
    }

    if (vapidKeys.publicKey && vapidKeys.privateKey) {
      webpush.setVapidDetails(
        'mailto:woojoo@spacekim.org',
        vapidKeys.publicKey,
        vapidKeys.privateKey,
      )
    }
  }

  async notifyComeToStore(reservationId: number) {
    const reservationInfo = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        userId: true,
        token: true,
      },
    })

    if (!reservationInfo) return
    if (!reservationInfo.userId && !reservationInfo.token) return

    const receivers = reservationInfo.userId
      ? [reservationInfo.userId]
      : [reservationInfo.token!]

    const title = reservationInfo.store.name ?? 'Reservation'
    const message = `오래 기다리셨습니다. 지금 방문해주세요!`

    if (reservationInfo.userId) {
      await this.saveNotification({
        userIds: receivers as number[],
        title,
        message,
        storeId: reservationInfo.store.id,
        type: 'ReservationReminder',
        url: `/reservation-check-page/${reservationId}`,
      })
    }

    await this.sendPushNotification(
      receivers,
      title,
      message,
      `/reservation-check-page/${reservationId}`,
    )
  }

  private async saveNotification({
    userIds,
    title,
    message,
    storeId,
    type = 'Other',
    url,
  }: {
    userIds: number[]
    title: string
    message: string
    storeId?: number
    type?: string
    url?: string
  }) {
    if (userIds.length === 0) {
      return
    }

    const notification = await this.prisma.notification.create({
      data: {
        title,
        message,
        url,
        type,
        storeId,
      },
    })

    const notificationRecords = userIds.map((userId) => ({
      notificationId: notification.id,
      userId,
    }))

    await this.prisma.notificationRecord.createMany({
      data: notificationRecords,
    })
  }

  private async sendPushNotification(
    receivers: number[] | string[],
    title: string,
    message: string,
    url?: string,
  ) {
    if (receivers.length === 0) {
      return
    }

    const pushWhere =
      typeof receivers[0] === 'number'
        ? { userId: { in: receivers as number[] } }
        : { token: { in: receivers as string[] } }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: pushWhere,
    })

    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/transparent.png',
      badge: '/joodang-badge.png',
      data: { url },
    })

    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          payload,
        )
      } catch (error) {
        console.error(
          `Failed to send push notification to user ${subscription.userId}:`,
          error,
        )

        if (error?.statusCode === 410) {
          await this.prisma.pushSubscription.delete({
            where: { id: subscription.id },
          })
        }
      }
    })

    await Promise.allSettled(sendPromises)
  }

  /**
   * 사용자의 알림 목록을 조회합니다
   * @param userId - 사용자 ID
   * @param cursor - 커서 기반 페이징을 위한 마지막 알림 ID
   * @param take - 가져올 알림 수 (기본값: 8)
   */
  async getNotifications(
    userId: number,
    cursor: number | null,
    take: number,
    isRead: boolean | null,
  ) {
    const paginator = this.prisma.getPaginator(cursor)

    const whereOptions = {
      userId,
      isRead: isRead !== null ? isRead : undefined,
    }

    const notificationRecords = await this.prisma.notificationRecord.findMany({
      ...paginator,
      take,
      where: whereOptions,
      include: {
        notification: true,
      },
      orderBy: {
        createTime: 'desc',
      },
    })

    return notificationRecords.map((record) => ({
      id: record.id,
      notificationId: record.notificationId,
      title: record.notification.title,
      message: record.notification.message,
      url: record.notification.url,
      type: record.notification.type,
      storeId: record.notification.storeId,
      isRead: record.isRead,
      createTime: record.createTime,
    }))
  }

  async notifyReservationReminder(reservationId: number, key: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        userId: true,
        store: { select: { id: true, name: true } },
        timeSlot: { select: { startTime: true } },
      },
    })

    try {
      if (!reservation) {
        throw new NotFoundException('Reservation Not Found')
      }
      if (!reservation.userId) {
        throw new UnprocessableEntityException('User Id set to null')
      }

      const title = reservation.store.name ?? '곧 예약 시간이에요'
      let message
      const timeLeft =
        reservation.timeSlot.startTime.getTime() - new Date().getTime()
      if (timeLeft <= 0) {
        message = '예약한 시간이 되었어요!'
      } else if (timeLeft <= 5 * 60 * 1000) {
        message = '예약한 시간 5분 전이에요!'
      } else {
        message = '예약한 시간 10분 전이에요!'
      }

      await this.saveNotification({
        userIds: [reservation.userId],
        title,
        message,
        storeId: reservation.store.id,
        type: 'ReservationReminder',
        url: `/reservation-check-page/${reservationId}`,
      })

      await this.sendPushNotification(
        [reservation.userId],
        title,
        message,
        `/reservation-check-page/${reservationId}`,
      )
    } catch {
      await this.jobService.markAsFailed(key)
    }
    await this.jobService.markAsDone(key)
  }

  async notifyOwnerReservationCreated(reservationId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        store: {
          select: {
            id: true,
            name: true,
            staffs: {
              select: {
                userId: true,
              },
            },
          },
        },
        timeSlot: {
          select: {
            totalCapacity: true,
          },
        },
      },
    })

    if (!reservation) return

    const receivers = reservation.store.staffs.map((staff) => staff.userId)
    const title = reservation.store.name ?? '새로운 예약'
    const message =
      reservation.timeSlot.totalCapacity === -1
        ? '새로운 대기 인원이 있어요. 확인해주세요🎉'
        : '새로운 예약 신청이 들어왔어요. 확인해주세요🎉'

    await this.saveNotification({
      userIds: receivers,
      title,
      message,
      storeId: reservation.store.id,
      type: 'OwnerReservation',
      url: `/management/reservation/${reservationId}`,
    })

    await this.sendPushNotification(
      receivers,
      title,
      message,
      `/management/reservation/${reservationId}`,
    )
  }

  async notifyOwnerReservationCanceled(storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        staffs: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!store) return

    const receivers = store.staffs.map((staff) => staff.userId)
    const title = store.name ?? '예약 취소'
    const message = '예약이 취소됐어요. 확인해주세요.'

    await this.saveNotification({
      userIds: receivers,
      title,
      message,
      storeId: store.id,
      type: 'OwnerReservation',
      url: `/management/reservation/`,
    })

    await this.sendPushNotification(
      receivers,
      title,
      message,
      `/management/reservation/`,
    )
  }

  async notifyReservationConfirmed(reservationId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        userId: true,
        store: { select: { id: true, name: true } },
      },
    })

    if (!reservation) return
    if (!reservation.userId) return

    const title = reservation.store.name ?? '예약 확정 알림'
    const message = `예약이 확정되었어요`

    await this.saveNotification({
      userIds: [reservation.userId],
      title,
      message,
      storeId: reservation.store.id,
      type: 'Reservation',
      url: `/reservation-check-page/${reservationId}`,
    })

    await this.sendPushNotification(
      [reservation.userId],
      title,
      message,
      `/reservation-check-page/${reservationId}`,
    )
  }

  async notifyReservationDeclined(reservationId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        id: true,
        userId: true,
        token: true,
        store: { select: { id: true, name: true } },
      },
    })

    if (!reservation) return
    if (!reservation.userId && !reservation.token) return

    const title = reservation.store.name ?? '예약 취소 알림'
    const message = `예약이 취소되었습니다.`
    const receiver = reservation.userId
      ? [reservation.userId]
      : [reservation.token!]

    if (reservation.userId) {
      await this.saveNotification({
        userIds: [reservation.userId],
        title,
        message,
        storeId: reservation.store.id,
        type: 'Reservation',
        url: `/reservation-check-page/${reservationId}`,
      })
    }

    await this.sendPushNotification(
      receiver,
      title,
      message,
      `/reservation-check-page/${reservationId}`,
    )
  }

  async notifyOwnerApplied() {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
    })

    const title = '관리자 알림'
    const message = '새로운 점주 신청이 도착했습니다. 확인해주세요.'
    const receivers = admins.map((admin) => admin.id)

    await this.saveNotification({
      userIds: receivers,
      title,
      message,
      type: 'OwnerApplication',
      url: '/',
    })

    await this.sendPushNotification(receivers, title, message, '/')
  }

  async notifyOwnerConfirmed(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    })

    if (!user) return

    const title = '점주 승인 알림'
    const message = `관리자 계정으로 변경 가능해요`

    await this.saveNotification({
      userIds: [userId],
      title,
      message,
      type: 'OwnerApplication',
      url: '/',
    })

    await this.sendPushNotification([userId], title, message, '/')
  }

  /**
   * 사용자의 모든 알림을 읽음으로 표시합니다
   * @param userId - 사용자 ID
   */
  async markAllAsRead(userId: number) {
    const updated = await this.prisma.notificationRecord.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return { successCount: updated.count }
  }

  /**
   * Push subscription을 생성합니다
   */
  async createPushSubscription(userId: number, dto: CreatePushSubscriptionDto) {
    if (!dto.tokens?.length) {
      try {
        return await this.prisma.pushSubscription.create({
          data: {
            userId,
            endpoint: dto.endpoint,
            p256dh: dto.keys.p256dh,
            auth: dto.keys.auth,
            userAgent: dto.userAgent,
          },
        })
      } catch (error) {
        if (error.code === 'P2002') {
          throw new UnprocessableEntityException(
            'Push subscription already exists',
          )
        }
        throw error
      }
    } else {
      const createData = dto.tokens.map((token) => ({
        userId,
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
        userAgent: dto.userAgent,
        token,
      }))

      return await this.prisma.pushSubscription.createMany({
        data: createData,
      })
    }
  }

  /**
   * VAPID public key를 반환합니다
   */
  getVapidPublicKey() {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY')
    if (!publicKey) {
      throw new Error('VAPID_PUBLIC_KEY is not configured')
    }
    return { publicKey }
  }

  /**
   * Push subscription을 삭제합니다
   * @param userId - 사용자 ID
   * @param endpoint - Push subscription endpoint (없으면 모든 subscription 삭제)
   */
  async deletePushSubscription(userId: number, endpoint?: string) {
    try {
      if (endpoint) {
        const deleted = await this.prisma.pushSubscription.delete({
          where: {
            //eslint-disable-next-line @typescript-eslint/naming-convention
            userId_endpoint: { userId, endpoint },
          },
        })
        return { deletedCount: 1, subscription: deleted }
      } else {
        const deleted = await this.prisma.pushSubscription.deleteMany({
          where: { userId },
        })
        return { deletedCount: deleted.count }
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('PushSubscription')
      }
      throw error
    }
  }
}
