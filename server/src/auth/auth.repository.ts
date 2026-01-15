import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload-interface';
import { Role } from './roles.enum';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(authRegisterDto: AuthRegisterDTO): Promise<void> {
    const { username, password, confPassword } = authRegisterDto;

    if (password === confPassword) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const createrUser = new this.userModel({
        username,
        password: hashedPassword,
      });

      try {
        createrUser.save();
      } catch (err) {
        if (err.code === '23505') {
          throw new ConflictException('This username already exists');
        } else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      throw new ConflictException('Confirm password doesnt match');
    }
  }

  async signIn(authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    const { username, password } = authLoginDto;

    const foundUser = await this.userModel
      .findOne({ username })
      .select('+password');

    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      const payload: JwtPayload = {
        username: foundUser.username,
        role: foundUser.role,
      };

      const accessToken: string = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new NotFoundException('Invalid login credentials');
    }
  }
}
