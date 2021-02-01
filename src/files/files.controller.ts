import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ParserService } from '../parser/parser.service';
import { IResultParsing } from '../parser/resultParsing.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly parserService: ParserService,
  ) {}

  @Get('test')
  async testMethod(): Promise<IResultParsing> {
    const buffer: Buffer = await this.filesService.getBufferOfFile('3.xlsx');
    const str: IResultParsing = this.parserService.parse({
      type: 'test',
      file: buffer,
    });
    return str;
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/',
    }),
  )
  async uploadFiles(@UploadedFile() file) {
    console.log(file);
  }
}
