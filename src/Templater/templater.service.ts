import { Injectable } from '@nestjs/common';
import { IMapper } from './Mapper/mapper.interface';
import { MainFullMapper } from './Mapper/Weekly/main.full.mapper';
import { CreateMapDto } from './DTO/createMap.dto';
import { FilesService } from '../Files/files.service';
import * as fs from 'fs';

@Injectable()
export class TemplaterService {
  constructor(private readonly storageService: FilesService) {}

  // async generateFiles(reportID: string): Promise<BinaryType> {
  //
  // }

  async mapFile(createMapDto: CreateMapDto) {
    const mapper: IMapper = new MainFullMapper();
    const file: Buffer = await this.storageService.getBufferOfFile(
      createMapDto.filename,
    );
    const map: Buffer = await mapper.mapTemplateByFile(file);
  }
}
