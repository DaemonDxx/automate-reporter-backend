import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserModel } from './schemas/user.schema';
import { ReqUser } from '../../utils/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('/user')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserByID(@Param('id') id: string): Promise<User | null> {
    const user: UserModel = await this.userService.findByID(id);
    if (!user) return;
    return new User(user);
  }

  @Get()
  async getSelfUserInfo(@ReqUser() user: User): Promise<User> {
    return user;
  }
}
