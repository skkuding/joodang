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

  @OnEvent('reservation.confirmed')
  async handleReservationConfirmed(payload: { reservationId: number }) {
    this.notificationService.notifyReservationConfirmed(payload.reservationId)
  }

  @OnEvent('owner.applied')
  async handleOwnerApplied() {
    this.notificationService.notifyOwnerApplied()
  }

  @OnEvent('owner.confirmed')
  async handleOwnerConfirmed(payload: { userId: number }) {
    this.notificationService.notifyOwnerConfirmed(payload.userId)
  }
}
