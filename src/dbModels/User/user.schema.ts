import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ACCESS_LIST, GetAccessListArray } from '../../User/access.list';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    enum: GetAccessListArray(),
    default: ACCESS_LIST.BASE,
  })
  access: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
