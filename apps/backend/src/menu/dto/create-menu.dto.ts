import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { MenuCategory } from '@prisma/client'

export class CreateMenuDto {
  @IsString()
  name: string

  @IsEnum(MenuCategory)
  category: MenuCategory

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsInt()
  @Min(0)
  price: number

  @IsInt()
  @Min(1)
  storeId: number
}
