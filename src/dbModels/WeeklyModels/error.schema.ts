import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Report } from './report.schema';
import { ParsedFile } from './file.schema';

@Schema()
export class ErrorOfFile extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParsedFile',
  })
  fromFile: ParsedFile;

  @Prop({
    required: true,
  })
  description: string;
}

export const ErrorSchema = SchemaFactory.createForClass(ErrorOfFile);
