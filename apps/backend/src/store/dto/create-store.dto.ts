import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsLatitude,
  IsLongitude,
  ValidateNested
} from 'class-validator';

export class TimeSlotInput {
  @Type(() => Date)
  @IsDate()
  startTime!: Date

  @Type(() => Date)
  @IsDate()
  endTime!: Date

  @IsInt()
  @IsPositive()
  totalCapacity!: number
}
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
  @IsOptional()
  organizer?: string

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

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ownerId: number

  @IsString()
  @IsNotEmpty()
  bankCode: string

  @IsString()
  @IsNotEmpty()
  accountNumber: string

  @IsString()
  @IsNotEmpty()
  accountHolder: string

  @IsString()
  location: string

  @Type(() => Number)
  @IsLatitude()
  latitude: number

  @Type(() => Number)
  @IsLongitude()
  longitude: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotInput)
  timeSlots!: TimeSlotInput[]
}