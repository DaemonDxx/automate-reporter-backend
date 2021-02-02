import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { ParserModule } from './parser/parser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './dbModels/WeeklyModels/report.schema';
import { DescriptionSchema } from './dbModels/WeeklyModels/description.schema';
import { ValueSchema } from './dbModels/WeeklyModels/value.schema';
import { ErrorSchema } from './dbModels/WeeklyModels/error.schema';
import { CheckerModule } from './checker/checker.module';

@Module({
  imports: [
    FilesModule,
    ParserModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
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
        name: 'ErrorOfReport',
        schema: ErrorSchema,
      },
    ]),
    CheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
