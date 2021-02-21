import { Injectable } from '@nestjs/common';
import { IMapper } from './Mapper/mapper.interface';
import { MainFullMapper } from './Mapper/Weekly/main.full.mapper';
import { CreateMapDto } from './DTO/createMap.dto';
import { StorageService } from '../Storage/storage.service';

@Injectable()
export class TemplaterService {
  constructor(private readonly storageService: StorageService) {}

  // async generateFiles(reportID: string): Promise<BinaryType> {
  //
  // }

  async mapFile(createMapDto: CreateMapDto) {
    const mapper: IMapper = new MainFullMapper();
    const file: Buffer = await this.storageService.getBufferOfFile(
      createMapDto.filename,
    );
    const map: Buffer = await mapper.mapTemplateByFile(file);
    const result = await this.storageService.saveFile(
      'full.xlsx',
      map,
      'map_files',
    );
  }
}
