import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Coefficient, TypesValue } from '../../../typings/modules/values';
import { Departments } from '../../../typings/departments';
import { Document } from 'mongoose';

export type CoefficientValueModel = CoefficientValue & Document;

@Schema()
export class CoefficientValue implements Coefficient {
  constructor(value: Omit<Coefficient, 'type'>) {
    Object.assign(this, value);
    this.type = TypesValue.Constant;
  }
  static Name = TypesValue.Constant;

  department: Departments;
  description: string;
  type: TypesValue.Constant;
  v: number;

  @Prop({
    required: true,
  })
  maxTemp: number;

  @Prop({
    required: true,
  })
  minTemp: number;
}

export const CoefficientSchema = SchemaFactory.createForClass(CoefficientValue);
