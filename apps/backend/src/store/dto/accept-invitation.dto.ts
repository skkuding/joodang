import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}