import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { NotificationListener } from './notification.listener'
import { JobModule } from '@app/job/job.module'

@Module({
  imports: [JobModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationListener],
})
export class NotificationModule {}
