import { IsIn, IsOptional, IsString } from 'class-validator';
import type { StoreSortFilter } from '../store.service';

export class GetStoresDto {
  @IsOptional()
  @IsString()
  @IsIn(['popular', 'fee', 'seats'])
  filter?: StoreSortFilter;
}