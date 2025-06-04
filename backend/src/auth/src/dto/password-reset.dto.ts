import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordResetDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  newEmail: string;
}
