import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ParserModule } from '../Parser/parser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from '../dbModels/WeeklyModels/report.schema';
import { DescriptionSchema } from '../dbModels/WeeklyModels/description.schema';
import { ValueSchema } from '../dbModels/WeeklyModels/value.schema';
import { ParsedFileSchema } from '../dbModels/WeeklyModels/file.schema';
import { CheckerModule } from '../Checker/checker.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    CheckerModule,
    ParserModule,
    MongooseModule.forFeature([
      {
        name: 'Report',
        schema: ReportSchema,
      },
      {
        name: 'Description',
        schema: DescriptionSchema,
      },
      {
        name: 'Value',
        schema: ValueSchema,
      },
      {
        name: 'ParsedFile',
        schema: ParsedFileSchema,
      },
    ]),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
