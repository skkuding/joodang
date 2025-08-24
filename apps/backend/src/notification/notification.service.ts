import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as webpush from 'web-push'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto'

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {
    const vapidKeys = {
      publicKey: this.config.get('VAPID_PUBLIC_KEY'),
      privateKey: this.config.get('VAPID_PRIVATE_KEY')
    }

    if (vapidKeys.publicKey && vapidKeys.privateKey) {
      webpush.setVapidDetails(
        'mailto:woojoo@spacekim.org',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      )
    }
  }

  async notifyComeToStore(reservationId: number) {
    const reservationInfo = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      select: {
        store: {
            select: {
                name: true
            }
        },
        userId: true
      }
    })

    const receivers = reservationInfo ? [reservationInfo.userId] : []

    const title = reservationInfo.store.name ?? 'Reservation'
    const message = `오래 기다리셨습니다. 지금 방문해주세요!`

    await this.saveNotification(
      receivers,
      title,
      message,
      '',
      ''
    )

    await this.sendPushNotification(receivers, title, message, '')
  }

  private async saveNotification(
    userIds: number[],
    title: string,
    message: string,
    type: string = 'Other',
    url?: string
  ) {
    if (userIds.length === 0) {
      return
    }

    const notification = await this.prisma.notification.create({
      data: {
        title,
        message,
        url,
        type
      }
    })

    const notificationRecords = userIds.map((userId) => ({
      notificationId: notification.id,
      userId
    }))

    await this.prisma.notificationRecord.createMany({
      data: notificationRecords
    })
  }

  private async sendPushNotification(
    userIds: number[],
    title: string,
    message: string,
    url?: string
  ) {
    if (userIds.length === 0) {
      return
    }

    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: {
        userId: { in: userIds }
      }
    })

    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/logos/transparent.png',
      badge: '/logos/codedang-badge.png',
      data: { url }
    })

    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          payload
        )
      } catch (error) {
        console.error(
          `Failed to send push notification to user ${subscription.userId}:`,
          error
        )

        if (error?.statusCode === 410) {
          await this.prisma.pushSubscription.delete({
            where: { id: subscription.id }
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
    isRead: boolean | null
  ) {
    const paginator = this.prisma.getPaginator(cursor)

    const whereOptions = {
      userId,
      isRead: isRead !== null ? isRead : undefined
    }

    const notificationRecords = await this.prisma.notificationRecord.findMany({
      ...paginator,
      take,
      where: whereOptions,
      include: {
        notification: true
      },
      orderBy: {
        createTime: 'desc'
      }
    })

    return notificationRecords.map((record) => ({
      id: record.id,
      notificationId: record.notificationId,
      title: record.notification.title,
      message: record.notification.message,
      url: record.notification.url,
      type: record.notification.type,
      isRead: record.isRead,
      createTime: record.createTime
    }))
  }


  /**
   * 사용자의 모든 알림을 읽음으로 표시합니다
   * @param userId - 사용자 ID
   */
  async markAllAsRead(userId: number) {
    const updated = await this.prisma.notificationRecord.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    return { successCount: updated.count }
  }

  /**
   * Push subscription을 생성합니다
   */
  async createPushSubscription(userId: number, dto: CreatePushSubscriptionDto) {
    try {
      return await this.prisma.pushSubscription.create({
        data: {
          userId,
          endpoint: dto.endpoint,
          p256dh: dto.keys.p256dh,
          auth: dto.keys.auth,
          userAgent: dto.userAgent
        }
      })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException('Push subscription already exists')
      }
      throw error
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
            userId_endpoint: { userId, endpoint }
          }
        })
        return { deletedCount: 1, subscription: deleted }
      } else {
        const deleted = await this.prisma.pushSubscription.deleteMany({
          where: { userId }
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
