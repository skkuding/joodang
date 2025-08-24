import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  DefaultValuePipe,
  ParseBoolPipe,
  Post,
  Body
} from '@nestjs/common'
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto'
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * 사용자의 알림 목록을 조회합니다.
   */
  @Get()
  async getNotifications(
    @Query('cursor') cursor: number | null,
    @Query('take', new DefaultValuePipe(8))
    take: number,
    @Query('isRead', new ParseBoolPipe({ optional: true }))
    isRead: boolean | null
  ) {
    return await this.notificationService.getNotifications(
      1,
      cursor,
      take,
      isRead
    )
  }

  /**
   * 모든 알림을 읽음으로 표시합니다.
   */
  @Patch('read-all')
  async markAllAsRead() {
    return await this.notificationService.markAllAsRead(1)
  }

  /**
   * Push subscription을 삭제합니다
   * endpoint가 제공되지 않으면 해당 사용자의 모든 subscription을 삭제합니다
   */
  @Delete('/push-subscription')
  async deletePushSubscription(
    @Query('endpoint') endpoint?: string
  ) {
    return this.notificationService.deletePushSubscription(
      1,
      endpoint
    )
  }

  /**
   * Push subscription을 생성합니다
   */
  @Post('/push-subscription')
  async createPushSubscription(
    @Body() dto: CreatePushSubscriptionDto
  ) {
    return this.notificationService.createPushSubscription(1, dto)
  }

  /**
   * VAPID public key를 반환합니다
   */
  @Get('/vapid')
  async getVapidPublicKey() {
    return this.notificationService.getVapidPublicKey()
  }
}
