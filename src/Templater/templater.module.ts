import { Module } from '@nestjs/common';
import { TemplaterService } from './templater.service';
import { TemplaterController } from './templater.controller';
import { FilesService } from '../Files/files.service';
import { FilesModule } from '../Files/files.module';
import { StorageModule } from '../Storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [TemplaterService],
  controllers: [TemplaterController],
})
export class TemplaterModule {}
