import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  async getBufferOfFile(filename: string): Promise<Buffer> {
    try {
      const buffer: Buffer = fs.readFileSync(join('./', filename));
      return buffer;
    } catch (e) {
      throw new Error(e);
    }
  }
}
