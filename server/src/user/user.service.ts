import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/auth/user.schema';
import { UserUpdateUsernameDto } from './dto/user-update-username.dto';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getTopUsers(): Promise<User[]> {
    return this.userRepository.getTopUsers();
  }

  async updateUsername(
    user: User,
    userUpdateUsernameDto: UserUpdateUsernameDto,
  ): Promise<{ accessToken }> {
    return this.userRepository.updateUsername(user, userUpdateUsernameDto);
  }

  async updatePassword(
    user: User,
    userUpdatePasswordDto: UserUpdatePasswordDto,
  ): Promise<void> {
    return this.userRepository.updatePassword(user, userUpdatePasswordDto);
  }
}
