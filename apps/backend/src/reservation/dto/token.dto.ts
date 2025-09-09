import { IsArray, IsString } from 'class-validator'

export class TokensDto {
  @IsArray()
  @IsString({ each: true })
  tokens: string[]
}
