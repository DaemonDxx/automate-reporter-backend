import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { dirname, join } from 'path';
import * as fs from 'fs';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MongooseCRUDService } from '../../utils/mongoose/MongooseCRUDService';
import { ParsebleFile, TypesFile } from '../../typings/modules/storage';
import { ParseResultStatus } from '../../typings/modules/parser';
import { ParseFailedEvent } from '../parser/events/parseFailed.event';
import { ParseSuccessEvent } from '../parser/events/parseSuccess.event';
import { OnEvent } from '@nestjs/event-emitter';
import { File } from './schemas/file.schema';

@Injectable()
export class StorageService extends MongooseCRUDService<ParsebleFile> {
  __dirname: string;

  constructor(
    @InjectModel(File.Name) private FileModel: Model<File>,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super(FileModel);
    this.__dirname = dirname(__dirname.replace('modules/storage', ''));
  }

  async getBufferOfFile(
    filename: string,
    dir = 'temp',
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

  async saveFile(filename: string, buffer: Uint8Array): Promise<string | null> {
    try {
      const fullPath: string = join(this.__dirname, 'temp', filename);
      await fs.promises.writeFile(fullPath, buffer);
      return filename;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getFileStatus(_id: string): Promise<ParseResultStatus> {
    const file: File = await this.FileModel.findById(_id);
    return file?.result;
  }

  @OnEvent('parse.*', { async: true })
  async failedParseFile(event: ParseFailedEvent | ParseSuccessEvent) {
    const file: File = await this.findByID(event._id);
    file.result = event.result;
    if (!(event instanceof ParseSuccessEvent)) {
      file.parseErrors = event.parseErrors;
      this.logger.error('Ошибка парсинга файла');
    } else {
      file.countValues = event.values.length;
      this.logger.log('Файл успешно распарсен');
    }
    await file.save();
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
