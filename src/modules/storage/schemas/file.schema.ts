import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParsebleFile, TypesFile } from '../../../typings/modules/storage';
import { Document } from 'mongoose';
import { ParseResultStatus } from '../../../typings/modules/parser';
import { toArray } from '../../../utils/toArray.function';
import * as mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class File extends Document implements ParsebleFile {
  static Name = 'File';

  @Prop({
    required: true,
  })
  filename: string;

  @Prop({
    required: true,
    default: TypesFile.NoType,
    enum: toArray(TypesFile),
  })
  type: TypesFile;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({
    required: true,
    default: ParseResultStatus.Ready,
    enum: toArray(ParseResultStatus),
  })
  result: ParseResultStatus;

  @Prop()
  countValues?: number;

  @Prop()
  parseErrors?: string[];
}

export const FileSchema = SchemaFactory.createForClass<File>(File);
