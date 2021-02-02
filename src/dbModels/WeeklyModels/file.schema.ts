import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Report } from './report.schema';

@Schema()
export class ParsedFile extends Document {
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

  @Prop({
    required: true,
  })
  department: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
  })
  report: Report;

  @Prop({
    default: [],
  })
  valueErrors: Array<string>;
}

export const ParsedFileSchema = SchemaFactory.createForClass(ParsedFile);
