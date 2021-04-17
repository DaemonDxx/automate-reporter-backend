import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ForTemperatureValue extends Document {
  @Prop({
    required: true,
  })
  department: string;

  @Prop({
    required: true,
  })
  year: number;

  @Prop({
    required: true,
  })
  month: number;

  @Prop({
    required: true,
  })
  value: number;

  @Prop({
    required: true,
    enum: Object.keys({}),
  })
  type: string;
}

export const ForTemperatureValueSchema = SchemaFactory.createForClass(
  ForTemperatureValue,
);
