import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from '../dbModels/WeeklyModels/report.schema';
import { DescriptionSchema } from '../dbModels/WeeklyModels/description.schema';
import { ValueSchema } from '../dbModels/WeeklyModels/value.schema';
import { ParsedFileSchema } from '../dbModels/WeeklyModels/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Report',
        schema: ReportSchema,
      },
    ]),
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
