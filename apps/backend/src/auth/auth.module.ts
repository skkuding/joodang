import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KakaoStrategy } from '@auth/kakao.strategy'
import { AuthController } from '@auth/auth.controller'
import { PrismaModule } from '@prisma/prisma.module'
import { AuthService } from '@auth/auth.service'
import { JwtStrategy } from '@auth/jwt.strategy'
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard'
import { OptionalJwtAuthGuard } from '@app/auth/guards/optional-jwt.guard'
import { AdminGuard } from '@app/auth/guards/admin.guard'
import { OwnerGuard } from './guards/owner.guard'
import { StaffGuard } from './guards/staff.guard'
import { KakaoAuthGuard } from './guards/kakao.guard'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: { expiresIn: '14d' },
      }),
    }),
    PrismaModule,
  ],
  providers: [
    KakaoStrategy,
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    AdminGuard,
    OwnerGuard,
    StaffGuard,
    KakaoAuthGuard,
  ],
  controllers: [AuthController],
  exports: [
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    AdminGuard,
    OwnerGuard,
    StaffGuard,
  ],
})
export class AuthModule {}
