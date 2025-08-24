import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationListener } from './notification.listener';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationListener],
})
export class NotificationModule {}
