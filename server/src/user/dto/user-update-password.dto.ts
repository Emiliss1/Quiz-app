import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdatePasswordDto {
  @IsString()
  password: string;

  @MinLength(8)
  @IsString()
  newPassword: string;

  @MinLength(8)
  @IsString()
  confNewPassword: string;
}
