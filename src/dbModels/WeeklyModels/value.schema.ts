import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Report } from './report.schema';
import { Description } from './description.schema';
import { ParsedFile } from './file.schema';

@Schema()
export class Value extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParsedFile',
  })
  fromFile: ParsedFile;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Description',
  })
  description: Description;

  @Prop({
    required: true,
  })
  v: number;
}

export const ValueSchema = SchemaFactory.createForClass(Value);
