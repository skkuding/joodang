import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'

export class PushSubscriptionKeysDto {
  @IsString()
  @IsNotEmpty()
  p256dh!: string

  @IsString()
  @IsNotEmpty()
  auth!: string
}

export class CreatePushSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  endpoint!: string

  @ValidateNested()
  @Type(() => PushSubscriptionKeysDto)
  keys!: PushSubscriptionKeysDto

  @IsOptional()
  @IsString()
  userAgent?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[]
}
