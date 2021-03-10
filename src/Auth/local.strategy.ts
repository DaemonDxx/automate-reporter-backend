import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../user/user.service';
import { User } from '../dbModels/User/user.schema';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly userService: UserService
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userService.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');
    delete user.password;
    return user;
  }

}