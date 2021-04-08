import { Logger, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { dirname, join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.Name, schema: FileSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination:
          process.env.UPLOAD_PATH || join(dirname(__dirname), 'uploads'),
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
  ],
  providers: [StorageService, Logger],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
