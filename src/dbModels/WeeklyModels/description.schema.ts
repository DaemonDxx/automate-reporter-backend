import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Description extends Document {
  @Prop({
    required: true,
  })
  forType: string;

  @Prop({
    required: true,
  })
  metadata: string;

  @Prop({
    required: true,
  })
  key: string;
}

export const DescriptionSchema = SchemaFactory.createForClass(Description);
