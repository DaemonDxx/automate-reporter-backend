import * as mongoose from 'mongoose';

export class ParseFileDto {
  filename: string;
  id_report: mongoose.Schema.Types.ObjectId;
}
