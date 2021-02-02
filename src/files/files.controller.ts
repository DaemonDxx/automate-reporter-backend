import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ParserService } from '../parser/parser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFileDto } from '../DTO/parseFile.dto';
import { ParsedFile } from '../dbModels/WeeklyModels/file.schema';

@Controller('file')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly parserService: ParserService,
  ) {}

  //Todo: Сделать модуль Storage для хранения и выдачи файлов
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/',
    }),
  )
  async uploadFiles(@UploadedFile() file) {
    console.log(file);
  }

  @Post()
  async createFile(@Body() parseFileOption: ParseFileDto): Promise<ParsedFile> {
    const file = await this.filesService.parseFile(parseFileOption);
    return file;
  }
}
