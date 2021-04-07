import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller, Get,
  Post, Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoggingInterceptor } from '../Utils/logging.interceptor';
import { CreateUserDTO } from './DTO/createUser.dto';
import { User, UserModel } from './Schemas/user.schema';
import { Roles } from '../Typings/Modules/Auth/user';
import { JWTToken } from '../Typings/Modules/Auth';

@Controller('/auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() { user }): Promise<JWTToken> {
    return this.authService.login(user);
  }

  @Post('/registration')
  @UseInterceptors(ClassSerializerInterceptor)
  async newUser(@Body() dto: CreateUserDTO): Promise<User> {
    const role: Roles = this.userService.validateKey(dto.key);
    if (!role) throw new UnauthorizedException('Секретный ключ не верный');
    const oldUser: UserModel[] = await this.userService.find({
      username: dto.username,
    });
    if (oldUser[0])
      throw new BadRequestException(
        'Пользователь с таким именем уже существует',
      );
    const newUser: UserModel = await this.userService.create({
      username: dto.username,
      password: dto.password,
      role,
    });
    return new User(newUser);
  }

}
