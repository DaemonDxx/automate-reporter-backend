import { BaseUploadFile } from '../Storage';
import { MongooseID, Timestamp } from '../../index';

export type BufferOfFile = {
  buffer: Buffer;
};

export type EventStorage$FileUpload = Omit<
  BaseUploadFile,
  keyof (Timestamp & Pick<BaseUploadFile, 'user'>)
> &
  MongooseID &
  BufferOfFile;
