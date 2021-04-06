import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { AuthGuard } from '@nestjs/passport';
import {
  BaseUploadFile,
  ParsebleFile,
  TypesFile,
} from '../Typings/Modules/Storage';
import { UpdateFileInfoDto } from './DTO/updateFileInfo.dto';
import { ParseResultStatus } from '../Typings/Modules/Parser';
import { EventEmitter2 } from 'eventemitter2';
import { FileUploadEvent } from './Events/fileUpload.event';
import { File } from './Schemas/file.schema';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly events: EventEmitter2,
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateFileInfo(@Body() dto: UpdateFileInfoDto): Promise<ParsebleFile> {
    const fileStatus = await this.storageService.getFileStatus(dto._id);
    if (fileStatus !== ParseResultStatus.Ready)
      throw new BadRequestException(
        'Информацию о файле невозможно обновить более одного раза',
      );
    const updatedFile = await this.storageService.update(dto);
    const buff: Buffer = await this.storageService.getBufferOfFile(
      updatedFile.filename,
    );
    this.events.emit(
      FileUploadEvent.Name,
      new FileUploadEvent({
        filename: updatedFile.filename,
        type: dto.type,
        _id: updatedFile._id,
        buffer: buff,
      }),
    );
    return updatedFile;
  }

  @Get(':id')
  async getFileInfo(@Query('id') id: string): Promise<File> {
    const file: File = await this.storageService.findByID(id);
    return file;
  }
}
