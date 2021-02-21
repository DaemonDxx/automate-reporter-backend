import { Document } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class ForTemperatureValue extends Document {

  @Prop({
    required: true
  })
  department: string;

  @Prop({
    required: true
    })
  year: number;

  @Prop({
    required: true
  })
  month: number;

  @Prop({
    required: true
  })
  value: number

  @Prop({
    required: true,
    enum: []
  })
  type: string

}