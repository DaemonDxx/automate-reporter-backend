import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoggingInterceptor } from '../../utils/logging.interceptor';
import { CreateUserDTO } from './dto/createUser.dto';
import { User, UserModel } from './schemas/user.schema';
import { Roles } from '../../typings/modules/auth/user';
import { JWTToken } from '../../typings/modules/auth';
import { REGISTRATION_KEYS } from './utils/regKey.constant';

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
  @UsePipes(ValidationPipe)
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
