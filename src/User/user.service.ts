import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../dbModels/User/user.schema';
import { CreateUserDTO } from './createUser.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly User: Model<User>) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    if (!this.validateKey(createUserDTO.key)) {
      throw new Error('Неверный ключ');
    }
    const oldUser = await this.User.findOne({
      username: createUserDTO.username,
    });
    if (oldUser) {
      throw new Error('Пользователь с таким именем уже существует');
    }
    const newUser = await new this.User({
      username: createUserDTO.username,
      password: createUserDTO.password,
    }).save();
    delete newUser.password;
    return newUser;
  }

  private validateKey(key: string): boolean {
    return key === 'Попробуй_отгадай';
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.User.findOne({
      username,
      password,
    });
    return user;
  }
}
