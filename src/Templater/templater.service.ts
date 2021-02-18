import { Injectable } from '@nestjs/common';
import { IMapper } from './Mapper/mapper.interface';
import { MainFullMapper } from './Mapper/Weekly/main.full.mapper';
import * as buffer from 'buffer';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class TemplaterService {

  // async generateFiles(reportID: string): Promise<BinaryType> {
  //
  // }

  async mapFile(filename: string) {
    const mapper: IMapper = new MainFullMapper();
    const file: Buffer = fs.readFileSync(
      join(
        'C:\\Users\\Iurii\\Documents\\GitHub\\automate-reporter-backend\\uploads',
        filename,
      ),
    );
    mapper.mapTemplateByFile(file);
  }

}
