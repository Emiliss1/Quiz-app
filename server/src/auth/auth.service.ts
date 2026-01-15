import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async createUser(authRegisterDto: AuthRegisterDTO): Promise<void> {
    return this.authRepository.createUser(authRegisterDto);
  }

  async signIn(authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.authRepository.signIn(authLoginDto);
  }
}
