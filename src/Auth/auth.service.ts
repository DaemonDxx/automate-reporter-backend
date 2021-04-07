import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserModel } from './Schemas/user.schema';
import { JWTToken } from '../Typings/Modules/Auth';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  login(user: User): JWTToken {
    return this.jwtService.sign({
      user,
    });
  }
}
