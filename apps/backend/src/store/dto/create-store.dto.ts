import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  organizer: string

  @IsString()
  @IsOptional()
  instagramId?: string

  @Type(() => Date)
  @IsDate()
  startTime: Date

  @Type(() => Date)
  @IsDate()
  endTime: Date

  @IsInt()
  reservationFee: number

  @IsString()
  @IsNotEmpty()
  college: string
}