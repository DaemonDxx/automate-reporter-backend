import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ParserService } from '../Parser/parser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFileDto } from '../DTO/parseFile.dto';
import { ParsedFile } from '../dbModels/WeeklyModels/file.schema';
import { diskStorage } from 'multer';

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
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          callback(null, true);
        } else {
          callback(new Error('Данный тип файла не поддерживается'), false);
        }
      },
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          callback(null, `${new Date().getMilliseconds()}.xlsx`);
        },
      }),
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
