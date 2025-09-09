import { IsArray, IsDefined, IsString } from 'class-validator'

export class TokensDto {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  tokens: string[]
}
