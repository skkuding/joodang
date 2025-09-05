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
  ValidateNested,
  IsIn
} from 'class-validator';

export class TimeSlotInput {
  @Type(() => Date)
  @IsDate()
  startTime!: Date

  @Type(() => Date)
  @IsDate()
  endTime!: Date
}
export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  college: string

  @IsString()
  @IsOptional()
  organizer?: string

  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  icon: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  totalCapacity: number

  @IsString()
  @IsOptional()
  contactInfo?: string

  @IsInt()
  reservationFee: number

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