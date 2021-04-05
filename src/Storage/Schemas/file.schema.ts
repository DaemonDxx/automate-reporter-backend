import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParsebleFile, TypesFile } from '../../Typings/Modules/Storage';
import { Document } from 'mongoose';
import { ParseResultStatus } from '../../Typings/Modules/Parser';
import { toArray } from '../../Utils/toArray.function';

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
  })
  user: string;

  @Prop({
    required: true,
    default: ParseResultStatus.Ready,
    enum: toArray(ParseResultStatus),
  })
  result: ParseResultStatus;

  @Prop()
  countValues?: number;

  @Prop()
  timeEnd?: Date;

  @Prop()
  timeStart?: Date;

  @Prop()
  parseErrors?: string[];
}

export const FileSchema = SchemaFactory.createForClass<File>(File);
