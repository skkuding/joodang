import {
  IsDateString,
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

  @IsDateString()
  startTime: string

  @IsDateString()
  endTime: string

  @IsInt()
  reservationFee: number

  @IsString()
  @IsNotEmpty()
  college: string
}