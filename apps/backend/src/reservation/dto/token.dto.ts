import { IsArray, IsOptional, IsString } from 'class-validator'

export class TokensDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens: string[]
}
