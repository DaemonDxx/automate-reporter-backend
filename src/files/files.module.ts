import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ParserModule } from '../parser/parser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from '../dbModels/WeeklyModels/report.schema';
import { DescriptionSchema } from '../dbModels/WeeklyModels/description.schema';
import { ValueSchema } from '../dbModels/WeeklyModels/value.schema';
import { ParsedFileSchema } from '../dbModels/WeeklyModels/file.schema';

@Module({
  imports: [
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
