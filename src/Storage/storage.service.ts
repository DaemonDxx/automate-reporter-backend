import { Injectable } from '@nestjs/common';
import { dirname, join } from 'path';
import * as fs from 'fs';
import { FileNotFoundError } from '../Utils/Errors/FileNotFound.error';

@Injectable()
export class StorageService {
  __dirname: string;

  constructor() {
    this.__dirname = dirname(__dirname);
  }

  async getBufferOfFile(filename: string, dir = 'uploads'): Promise<Buffer> {
    try {
      const fullPath: string = join(this.__dirname, dir, filename);
      const buffer: Buffer = await fs.promises.readFile(fullPath);
      return buffer;
    } catch (e) {
      console.error(e);
      throw new FileNotFoundError(filename);
    }
    return;
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
}
