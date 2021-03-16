import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../User/user.service';
import { LoggingInterceptor } from '../Utils/logging.interceptor';

@Controller('/auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req): Promise<any> {
    return this.authService.login(req.user);
  }
}
