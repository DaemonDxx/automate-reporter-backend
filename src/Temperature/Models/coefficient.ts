import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coefficient extends Document {
  @Prop({
    required: true,
  })
  department: string;

  @Prop({
    required: true,
  })
  tag: string;

  @Prop({
    required: true,
  })
  minTemp: number;

  @Prop({
    required: true,
  })
  maxTemp: number;

  @Prop({
    required: true,
  })
  value: number;
}

export const CoefficientSchema = SchemaFactory.createForClass(Coefficient);
