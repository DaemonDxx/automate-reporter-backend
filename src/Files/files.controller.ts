import {
  BadRequestException,
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
          callback(null, false);
        }
      },
      storage: diskStorage({
        destination: 'uploads',
        FILENAME: (req, file, callback) => {
          callback(null, `${new Date().getMilliseconds()}.xlsx`);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFile() file) {
    if (!file) throw new BadRequestException({message: 'Данный тип файла не поддерживается'});
    return {}
    console.log(file);
  }

  @Post()
  async createFile(@Body() parseFileOption: ParseFileDto): Promise<ParsedFile> {
    const file = await this.filesService.parseFile(parseFileOption);
    return file;
  }
}
