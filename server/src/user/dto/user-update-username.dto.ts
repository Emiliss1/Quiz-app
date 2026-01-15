import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdateUsernameDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  newUsername: string;

  @IsString()
  password: string;
}
