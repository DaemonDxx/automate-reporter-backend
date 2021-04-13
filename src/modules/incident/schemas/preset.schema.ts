import { User } from '../../auth/schemas/user.schema';
import { Incident } from './incident.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

export type PresetModel = Preset & Document;

@Schema({
  timestamps: true,
})
export class Preset {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  fromUser: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Incident.name,
    autopopulate: true,
  })
  incidents: Incident[];
}

export const PresetSchema = SchemaFactory.createForClass(Preset);
PresetSchema.plugin(autopopulate);
