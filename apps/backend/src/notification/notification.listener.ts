import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { NotificationService } from './notification.service'

@Injectable()
export class NotificationListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('come.to.store')
  async handleComeToStore(payload: { reservationId: number }) {
    this.notificationService.notifyComeToStore(payload.reservationId)
  }
}
