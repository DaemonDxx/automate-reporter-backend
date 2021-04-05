import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { dirname, join } from 'path';
import * as fs from 'fs';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ParsebleFile, TypesFile } from '../Typings/Modules/Storage';
import { MongooseCRUDService } from '../Utils/mongoose/MongooseCRUDService';
import { File } from './Schemas/file.schema';
import { ParseResultStatus } from '../Typings/Modules/Parser';

@Injectable()
export class StorageService extends MongooseCRUDService<ParsebleFile> {
  __dirname: string;

  constructor(
    @InjectModel(File.Name) private FileModel: Model<File>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(FileModel);
    this.__dirname = dirname(__dirname);
  }

  async getBufferOfFile(
    filename: string,
    dir = 'uploads',
  ): Promise<Buffer | null> {
    try {
      const fullPath: string = join(this.__dirname, dir, filename);
      const buffer: Buffer = await fs.promises.readFile(fullPath);
      return buffer;
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }

  //Todo Сделать обработку ошибок
  async saveFile(
    filename: string,
    buffer: Buffer,
    dir = 'uploads',
  ): Promise<boolean> {
    const fullPath: string = join(this.__dirname, dir, filename);
    await fs.promises.writeFile(fullPath, buffer);
    return true;
  }

  async getFileStatus(_id: string): Promise<ParseResultStatus> {
    const file: ParsebleFile = await this.FileModel.findById(_id);
    return file.result;
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async deleteNoTypeFiles() {
    const noTypeFiles = await this.find({
      type: TypesFile.NoType,
    });
    for (const file of noTypeFiles) {
      try {
        await fs.promises.unlink(
          join(this.__dirname, 'uploads', file.filename),
        );
        await file.delete();
      } catch (e) {
        this.logger.error(`Не удалось удалить файл ${file.filename}`);
      }
      this.logger.log(`Удален файл без типа: ${file.filename}`);
    }
  }
}
