import { Injectable } from '@nestjs/common';
import { dirname, join } from 'path';
import fs from 'fs';

@Injectable()
export class StorageService {

  __dirname: string;

  constructor() {
    this.__dirname = dirname(__dirname);
  }

  async getBufferOfFile(filename: string, dir = 'uploads'): Promise<Buffer> {
    const fullPath: string = join(this.__dirname, dir, filename);
    const buffer: Buffer = await fs.promises.readFile(fullPath);
    return buffer;
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


