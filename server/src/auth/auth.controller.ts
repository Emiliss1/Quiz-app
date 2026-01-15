import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() authRegisterDto: AuthRegisterDTO): Promise<void> {
    return this.authService.createUser(authRegisterDto);
  }

  @Post('/signin')
  signIn(@Body() authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authLoginDto);
  }
}
