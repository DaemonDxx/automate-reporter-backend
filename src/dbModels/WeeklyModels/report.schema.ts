import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ParsedFile } from './file.schema';

@Schema()
export class Report extends Document {
  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
    default: () => {
      return new Date().getFullYear();
    },
  })
  year: number;

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
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParsedFile',
      },
    ],
  })
  files: ParsedFile[];

  @Prop({
    default: 'Отчет без описания',
  })
  description: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
