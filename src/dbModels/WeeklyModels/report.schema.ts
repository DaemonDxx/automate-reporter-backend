import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Report extends Document {
  @Prop({
    required: true,
    default: () => {
      return new Date().getFullYear();
    },
  })
  yeah: number;

  @Prop({
    required: true,
    default: () => {
      return new Date().getMonth();
    },
  })
  month: number;

  @Prop({
    required: true,
    default: () => {
      return new Date().getDay();
    },
  })
  day: number;

  @Prop({
    required: true,
  })
  version: number;

  @Prop({
    default: () => {
      return new Date();
    },
  })
  dateAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
