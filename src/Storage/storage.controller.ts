import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StorageService } from './storage.service';
import { dirname, join } from 'path';

@Controller('storage')
export class StorageController {

  constructor(
    private readonly storageService: StorageService
  ) {
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const res =
          file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        callback(null, res);
      },
      storage: diskStorage({
        destination: join(dirname(__dirname)),
        filename: (req, file, callback) => {
          const date = new Date();
          callback(
            null,
            `${date.getFullYear()}.${
              date.getMonth() + 1
            }.${date.getDay()}-${Math.random()}.xlsx`,
          );
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFile() file) {
    if (!file)
      throw new BadRequestException({
        message: 'Данный тип файла не поддерживается',
      });
    return { filename: file.filename };
  }


}
