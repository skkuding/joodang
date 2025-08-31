import { IsEnum, IsOptional, IsInt, IsDate, Min } from 'class-validator'
import { Type } from 'class-transformer'

const storeSortFilter = ['popular', 'fee', 'seats'] as const
export type StoreSortFilter = (typeof storeSortFilter)[number]

export class GetStoresDto {
  @IsOptional()
  @IsEnum(storeSortFilter)
  sort?: StoreSortFilter

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minFee?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxFee?: number

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date
}
