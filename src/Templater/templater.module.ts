import { Module } from '@nestjs/common';
import { TemplaterService } from './templater.service';
import { TemplaterController } from './templater.controller';
import { FilesService } from '../Files/files.service';

@Module({
  imports: [FilesService],
  providers: [TemplaterService],
  controllers: [TemplaterController]
})
export class TemplaterModule {}
