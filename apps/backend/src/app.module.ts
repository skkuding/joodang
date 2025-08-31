import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { StoreModule } from './store/store.module'
import { ReservationModule } from './reservation/reservation.module'
import { NotificationModule } from './notification/notification.module'
import { MenuModule } from './menu/menu.module'
import { PrismaModule } from '@prisma/prisma.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    StoreModule,
    ReservationModule,
    NotificationModule,
    MenuModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
