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
  Req,
  Res,
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
} from '../../typings/modules/storage';
import { UpdateFileInfoDto } from './dto/updateFileInfo.dto';
import { ParseResultStatus } from '../../typings/modules/parser';
import { EventEmitter2 } from 'eventemitter2';
import { FileUploadEvent } from './events/fileUpload.event';
import { ReqUser } from '../../utils/decorators/user.decorator';
import { User } from '../auth/schemas/user.schema';
import { File } from './schemas/file.schema';

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
    @ReqUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseUploadFile> {
    if (!file) throw new BadRequestException('Файл не загружен');
    const newFile = await this.storageService.create({
      user: user._id,
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

  @Get('/file/:id')
  async getFileInfo(@Param('id') id: string): Promise<File> {
    const file: File = await this.storageService.findByID(id);
    return file;
  }

  @Get('/:filename')
  async downloadFile(
    @Param('filename') filename: string,
  ): Promise<Uint8Array> {
    const buffer = await this.storageService.getBufferOfFile(filename);
    const uintArray = new Uint8Array(buffer);
    return uintArray;
  }
}
