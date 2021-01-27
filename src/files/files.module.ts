import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ParserModule } from '../parser/parser.module';

@Module({
  imports: [ParserModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
