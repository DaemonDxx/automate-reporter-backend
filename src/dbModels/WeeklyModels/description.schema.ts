import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Description extends Document {
  @Prop({
    required: true,
  })
  department: string;

  @Prop({
    required: true,
  })
  branch: string;

  @Prop()
  consumer: string;

  @Prop({
    required: true,
    enum: ['now', 'before'],
  })
  year: string;

  @Prop({
    required: true,
  })
  key: string;
}

export const DescriptionSchema = SchemaFactory.createForClass(Description);
