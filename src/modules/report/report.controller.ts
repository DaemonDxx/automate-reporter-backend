import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { ReportPayload } from './dto/report.payload';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createReport(@Body() dto: ReportPayload): Promise<string> {
    const filename = await this.reportService.generateReport(dto);
    return filename;
  }
}
