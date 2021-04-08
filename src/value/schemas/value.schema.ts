import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseValue,
  Electricity,
  Temperature,
  TypesValue,
} from '../../Typings/Modules/Values';
import { Departments } from '../../Typings/departments';
import { Document } from 'mongoose';
import { toArray } from '../../Utils/toArray.function';
import * as mongoose from 'mongoose';
import { User } from '../../Auth/Schemas/user.schema';
import { File } from '../../Storage/Schemas/file.schema';

export type ValueModel = Value & Document;

@Schema({
  discriminatorKey: 'type',
})
export class Value implements BaseValue {
  constructor(value: Electricity | Temperature) {
    Object.assign(this, value);
  }

  @Prop({
    required: true,
    enum: toArray(Departments),
  })
  department: Departments;

  @Prop({
    default: 'Без описания',
  })
  description: string;

  @Prop({
    required: true,
    enum: toArray(TypesValue),
  })
  type: TypesValue;

  @Prop({
    required: true,
  })
  v: number;

  @Prop()
  year?: number;

  @Prop()
  month?: number;

  @Prop()
  day?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  fromUser?: mongoose.Schema.Types.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  })
  fromFile?: mongoose.Schema.Types.ObjectId | string;
}

export const ValueSchema = SchemaFactory.createForClass(Value);
