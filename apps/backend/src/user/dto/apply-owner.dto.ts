import { IsNotEmpty, IsString, Length } from 'class-validator'

export class ApplyOwnerDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  phone: string
}
