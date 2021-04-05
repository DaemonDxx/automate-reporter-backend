import { EventStorage$FileUpload } from '../../Typings/Modules/Events/storage';
import { TypesFile } from '../../Typings/Modules/Storage';
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
