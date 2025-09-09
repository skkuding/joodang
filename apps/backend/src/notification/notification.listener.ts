import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { NotificationService } from './notification.service'
import { JobService } from '@app/job/job.service'

const RESERVATION_REMINDER = [
  { id: '10m', offset: -10 * 60 * 1000 },
  { id: '5m', offset: -5 * 60 * 1000 },
  { id: 'now', offset: 0 },
]

@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jobService: JobService,
  ) {}

  private reservationDueReminderKey(reservationId: number, reminderId: string) {
    return `reservation:${reservationId}:due-reminder:${reminderId}`
  }

  private everyReservationDueReminderKey(reservationId: number) {
    return RESERVATION_REMINDER.map((reminder) =>
      this.reservationDueReminderKey(reservationId, reminder.id),
    )
  }

  private calculateFireAt(startTime: Date, offset: number) {
    return new Date(startTime.getTime() + offset)
  }

  @OnEvent('come.to.store')
  async handleComeToStore(payload: { reservationId: number }) {
    this.notificationService.notifyComeToStore(payload.reservationId)
  }

  @OnEvent('reservation.created')
  async handlerReservationCreated(payload: {
    reservationId: number
    startTime: Date
  }) {
    this.notificationService.notifyOwnerReservationCreated(
      payload.reservationId,
    )

    if (payload.startTime) {
      const reminders = RESERVATION_REMINDER.map((reminder) => {
        const key = this.reservationDueReminderKey(
          payload.reservationId,
          reminder.id,
        )
        const fireAt = this.calculateFireAt(payload.startTime, reminder.offset)
        if (fireAt.getTime() - new Date().getTime() <= 0) {
          return null
        }
        return this.jobService.createJob(
          key,
          fireAt,
          { reservationId: payload.reservationId },
          'reservation.reminder',
        )
      }).filter(Boolean)

      await Promise.all(reminders)
    }
  }

  @OnEvent('reservation.canceled')
  async handlerReservationCanceled(payload: {
    reservationId: number
    storeId: number
  }) {
    this.notificationService.notifyOwnerReservationCanceled(payload.storeId)

    this.jobService.deleteJobs(
      this.everyReservationDueReminderKey(payload.reservationId),
    )
  }

  @OnEvent('reservation.reminder')
  async handleReservationReminder(payload: {
    key: string
    reservationId: number
  }) {
    this.notificationService.notifyReservationReminder(
      payload.reservationId,
      payload.key,
    )
  }

  @OnEvent('reservation.confirmed')
  async handleReservationConfirmed(payload: { reservationId: number }) {
    this.notificationService.notifyReservationConfirmed(payload.reservationId)
  }

  @OnEvent('reservation.declined')
  async handleReservationDeclined(payload: { reservationId: number }) {
    this.notificationService.notifyReservationDeclined(payload.reservationId)

    this.jobService.deleteJobs(
      this.everyReservationDueReminderKey(payload.reservationId),
    )
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
