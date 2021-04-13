import {
  Importance,
  SomeIncident,
  TypesIncidents,
} from '../../../typings/modules/incident';
import { SomeValue } from '../../../typings/modules/values';
import { Departments } from '../../../typings/departments';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Value } from '../../value/schemas/value.schema';
import { toArray } from '../../../utils/toArray.function';
import { Document } from 'mongoose';
import * as autopopulate from 'mongoose-autopopulate';

export type IncidentModel = Incident & Document;

@Schema({
  timestamps: true,
})
export class Incident implements SomeIncident {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Value.name,
    autopopulate: true,
  })
  Reception: SomeValue;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Value.name,
    autopopulate: true,
  })
  Recoil: SomeValue;

  @Prop({
    required: true,
    enum: toArray(Departments),
  })
  department: Departments;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  isOnce: boolean;

  @Prop({
    required: true,
    enum: toArray(TypesIncidents),
  })
  type: TypesIncidents;

  @Prop({
    required: true,
  })
  year: number;

  @Prop({
    required: true,
    enum: toArray(Importance),
  })
  importance: Importance;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
IncidentSchema.plugin(autopopulate);
