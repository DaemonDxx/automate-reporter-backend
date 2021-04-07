import { Injectable } from '@nestjs/common';
import { User, UserModel } from './Schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '../Utils/mongoose/MongooseCRUDService';
import { Roles } from '../Typings/Modules/Auth/user';

@Injectable()
export class UserService extends MongooseCRUDService<User> {
  constructor(@InjectModel('User') private readonly User: Model<UserModel>) {
    super(User);
  }

  validateKey(key: string): Roles | null {
    switch (key) {
      case 'VIEWER':
        return Roles.VIEWER;
      case 'CREATOR':
        return Roles.CREATOR;
      case 'MODERATOR':
        return Roles.MODERATOR;
    }
    return null;
  }

  async validateUser(username: string, password: string): Promise<UserModel> {
    const user: UserModel = await this.User.findOne({
      username,
      password,
    });
    return user;
  }
}
