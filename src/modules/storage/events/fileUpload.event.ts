import { EventStorage$FileUpload } from '../../../typings/modules/events/storage';
import { TypesFile } from '../../../typings/modules/storage';
import * as mongoose from 'mongoose';

export class FileUploadEvent implements EventStorage$FileUpload {
  static Name = 'storage.upload';

  constructor(eventInfo: EventStorage$FileUpload) {
    Object.assign(this, eventInfo);
  }

  filename: string;
  type: TypesFile;
  _id: mongoose.Schema.Types.ObjectId;
  buffer: Buffer;
}
