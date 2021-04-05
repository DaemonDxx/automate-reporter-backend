import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
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

  // @Post()
  // async createFile(@Body() parseFileOption: ParseFileDto): Promise<ParsedFile> {
  //   const file = await this.filesService.parseFile(parseFileOption);
  //   return file;
  // }

  @Get()
  async getFilesByReport(
    @Query('report') reportID: string,
  ): Promise<ParsedFile[]> {
    return this.filesService.getFilesByReport(reportID);
  }

  @Put()
  async setActive(@Body('fileID') fileID: string): Promise<ParsedFile> {
    return this.filesService.updateStatusFile(fileID);
  }
}
