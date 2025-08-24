import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotInput)
  timeSlots!: TimeSlotInput[]
}