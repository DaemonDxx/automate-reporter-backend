import { Injectable } from '@nestjs/common';
import { UserService } from '../User/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../dbModels/User/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    return {
      token: this.jwtService.sign({
        user,
        UID: user._id,
      }),
      user,
    };
  }
}
