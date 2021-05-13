import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, Res,
  UsePipes,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDTO } from './dto/createReport.dto';
import { Response } from 'express';
import * as fs from 'fs';
import { ReportBuilder } from './report.builder';
import { Buffer } from 'buffer';

@Controller('report')
export class ReportController {
  constructor(private readonly reportBuilder: ReportBuilder) {}

  @Post()
  async createReport(@Res() res: Response, @Body() dto: CreateReportDTO) {
    const file = await this.reportBuilder.build(dto);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'test');
    res.send(new Buffer(file));
  }
}
