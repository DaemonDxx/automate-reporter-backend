import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from './user.service';
import { User, UserModel } from './schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user: UserModel = await this.userService.validateUser(
      username,
      password,
    );
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');
    const u: User = new User(user);
    delete u.password;
    return u;
  }
}
