import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Report } from './report.schema';

@Schema()
export class ErrorOfReport extends Document {

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  })
  report: Report;

  @Prop({
    required: true
  })
  description: string

}

export const ErrorSchema = SchemaFactory.createForClass(ErrorOfReport);