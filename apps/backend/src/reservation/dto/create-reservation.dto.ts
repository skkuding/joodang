import { IsArray, IsInt, IsOptional, Min } from 'class-validator'

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  headcount: number

  @IsInt()
  @Min(1)
  userId: number

  @IsInt()
  @Min(1)
  storeId: number

  @IsInt()
  @Min(1)
  timeSlotId: number

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  menuIds?: number[]
}
