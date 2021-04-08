import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { toArray } from '../../../utils/toArray.function';
import { Roles, UserInfo } from '../../../typings/modules/auth/user';
import { Exclude } from 'class-transformer';
import * as mongoose from 'mongoose';

export type UserModel = User & Document;

@Schema()
export class User implements UserInfo {
  constructor(user: UserModel) {
    this._id = user._id.toString();
    this.role = user.role;
    this.password = user.password;
    this.username = user.username;
  }

  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
  })
  username: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    enum: toArray(Roles),
    default: Roles.VIEWER,
  })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
