import { IsNotEmpty, IsString } from 'class-validator';

export class AddStaffDto {
  @IsString()
  @IsNotEmpty()
  kakaoId: string;
}