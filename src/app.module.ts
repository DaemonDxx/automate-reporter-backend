import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { MongooseModule } from '@nestjs/mongoose';

import { ReportModule } from './report/report.module';

@Module({
  imports: [
    FilesModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
