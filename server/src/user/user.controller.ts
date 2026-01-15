import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/auth/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { UserUpdateUsernameDto } from './dto/user-update-username.dto';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('/profile')
  getProfile(@GetUser() user: User) {
    return { username: user.username, role: user.role, points: user.points };
  }

  @Get('/topusers')
  getTopUsers(): Promise<User[]> {
    return this.userService.getTopUsers();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('/updateusername')
  updateUsername(
    @GetUser() user: User,
    @Body() userUpdateUsernameDto: UserUpdateUsernameDto,
  ): Promise<{ accessToken }> {
    return this.userService.updateUsername(user, userUpdateUsernameDto);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('/updatepassword')
  updatePassword(
    @GetUser() user: User,
    @Body() userUpdatePasswordDto: UserUpdatePasswordDto,
  ): Promise<void> {
    return this.userService.updatePassword(user, userUpdatePasswordDto);
  }
}
