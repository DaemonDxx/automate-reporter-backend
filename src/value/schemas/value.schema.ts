import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseValue,
  Electricity,
  Temperature,
  TypesValue,
} from '../../Typings/Values';
import { Departments } from '../../Typings/departments';
import { Document } from 'mongoose';
import { toArray } from '../../Utils/toArray.function';

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
}

export const ValueSchema = SchemaFactory.createForClass(Value);
