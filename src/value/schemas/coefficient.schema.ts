import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Coefficient, TypesValue } from '../../Typings/Modules/Values';
import { Departments } from '../../Typings/departments';
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
