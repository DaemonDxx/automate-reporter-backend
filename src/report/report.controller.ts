import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Report } from '../dbModels/WeeklyModels/report.schema';
import { CreateReportDto } from '../DTO/createReport.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(
    @Body() createReportDTO: CreateReportDto,
  ): Promise<Report> {
    return await this.reportService.createReport(createReportDTO);
  }

  @Get(':id')
  async getReport(@Query('id') _idReport: string): Promise<Report> {
    return await this.reportService.getReport(_idReport);
  }

  @Put()
  async updateReport(@Body() report: Report): Promise<Report> {
    return await this.updateReport(report);
  }
}
