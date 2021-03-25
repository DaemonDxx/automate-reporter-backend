import {
  Event$FileUpload,
  Payload$FileUpload,
} from '../../Typings/Modules/Events';
import { BaseEvent } from '../../Events';

export class FileUploadEvent extends BaseEvent implements Event$FileUpload {
  static Name = 'storage.upload';
  filename: string;
  user_id: string;

  constructor(payload: Payload$FileUpload) {
    super();
    this.filename = payload.filename;
    this.user_id = payload.user_id;
  }
}
