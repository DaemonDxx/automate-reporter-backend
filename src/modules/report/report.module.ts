import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageModule } from '../storage/storage.module';
import { ReportBuilder } from './report.builder';

@Module({
  imports: [StorageModule],
  providers: [ReportService, ReportBuilder],
  controllers: [ReportController],
})
export class ReportModule {}
