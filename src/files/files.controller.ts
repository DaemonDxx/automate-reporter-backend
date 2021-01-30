import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { ParserService } from '../parser/parser.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly parserService: ParserService,
  ) {}

  @Get('test')
  async testMethod() {
    const buffer: Buffer = await this.filesService.getBufferOfFile('3.xlsx');
    const str: string = this.parserService.parse({
      type: 'test',
      file: buffer,
    });
  }
}
