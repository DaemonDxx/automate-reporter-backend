import {
  BadRequestException, Body,
  Controller,
  Inject,
  Logger,
  LoggerService,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseUploadFile, ParsebleFile, TypesFile } from '../Typings/Modules/Storage';
import { UpdateFileInfoDto } from './DTO/updateFileInfo.dto';
import { ParseResultStatus } from '../Typings/Modules/Parser';
import { toArray } from '../Utils/toArray.function';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly storageService: StorageService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseUploadFile> {
    if (!file) throw new BadRequestException('Файл не загружен');
    const newFile = await this.storageService.create({
      user: 'root',
      filename: file.filename,
      type: TypesFile.NoType,
      result: ParseResultStatus.Ready,
    });
    this.logger.log(
      `Сохранен файл ${newFile.filename}, пользователь: ${newFile.user}`,
    );
    return newFile;
  }

  @Post('/file')
  @UsePipes(ValidationPipe)
  async updateFileInfo(@Body() dto: UpdateFileInfoDto): Promise<ParsebleFile> {
    if (toArray(TypesFile).includes(dto.type)) {
      const updatedFile = await this.storageService.update(dto);
      return updatedFile;
    } else {
      throw new BadRequestException('Данный тип файлов не поддерживается');
    }
  }
}
