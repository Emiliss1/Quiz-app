import { IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
