import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { TokensDto } from './token.dto'
import { Type } from 'class-transformer'

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  headcount: number

  @IsInt()
  @Min(1)
  storeId: number

  @IsString()
  phone: string

  @IsInt()
  @Min(1)
  timeSlotId: number

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  menuIds?: number[]
}

export class CreateWalkInReservationDto {
  @IsInt()
  @Min(1)
  headcount: number

  @IsInt()
  @Min(1)
  storeId: number

  @IsString()
  phone: string

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  menuIds?: number[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[]
}
