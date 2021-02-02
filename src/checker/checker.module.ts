import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckerWeeklyStrategy } from './CheckStategy/checker.weekly.strategy';
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
  providers: [CheckerService, CheckerWeeklyStrategy],
  exports: [CheckerService],
})
export class CheckerModule {}
