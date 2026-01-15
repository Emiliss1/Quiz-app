import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { UserUpdateUsernameDto } from './dto/user-update-username.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/jwt-payload-interface';
import { JwtService } from '@nestjs/jwt';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getTopUsers(): Promise<User[]> {
    const foundUsers = await this.userModel
      .find({ points: { $gte: 1 } })
      .sort({ points: 'desc' })
      .limit(10);

    if (!foundUsers) throw new NotFoundException('users not found');

    return foundUsers;
  }

  async updateUsername(
    user: User,
    userUpdateUsernameDto: UserUpdateUsernameDto,
  ): Promise<{ accessToken }> {
    const { newUsername, password } = userUpdateUsernameDto;

    const foundUser = await this.userModel
      .findOne({ _id: user._id })
      .select('+password');

    if (!foundUser) throw new NotFoundException('user was not found');

    if (newUsername === user.username)
      throw new BadRequestException('you cant use the same username');

    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      try {
        const payload: JwtPayload = {
          username: newUsername,
          role: user.role,
        };

        foundUser.username = newUsername;

        foundUser.save();

        const accessToken: string = await this.jwtService.sign(payload);

        return { accessToken };
      } catch (err) {
        if (err.code === '23505') {
          throw new ConflictException('This username is taken');
        } else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      throw new ConflictException('Wrong password');
    }
  }

  async updatePassword(
    user: User,
    userUpdatePasswordDto: UserUpdatePasswordDto,
  ): Promise<void> {
    const { password, newPassword, confNewPassword } = userUpdatePasswordDto;

    const foundUser = await this.userModel
      .findOne({ _id: user._id })
      .select('+password');

    if (!foundUser) throw new NotFoundException('user was not found');

    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      if (newPassword === confNewPassword) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.password = hashedPassword;

        foundUser.save();
      } else {
        throw new ConflictException('Confirm password doesnt match');
      }
    } else {
      throw new ConflictException('Wrong password');
    }
  }
}
