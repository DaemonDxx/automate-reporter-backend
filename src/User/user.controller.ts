import { BadRequestException, Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './createUser.dto';
import { User } from '../dbModels/User/user.schema';
import { UserService } from './user.service';
import { LoggingInterceptor } from '../Utils/logging.interceptor';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService
  ) {
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const user = await this.userService.createUser(createUserDTO);
      return user;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    return null;
  }
}
