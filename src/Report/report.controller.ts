import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { Report } from '../dbModels/WeeklyModels/report.schema';
import { CreateReportDto } from '../DTO/createReport.dto';
import { ReportService } from './report.service';
import { IGetReportQuery } from './get.query.interface';
import { GetReportValidationPipe } from './validation.pipes';

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
  async getReport(@Param('id') _idReport: string): Promise<Report> {
    return await this.reportService.getReport(_idReport);
  }

  @Put()
  async updateReport(@Body() report: Report): Promise<Report> {
    return await this.reportService.updateReport(report);
  }

  @Get()
  @UsePipes(new GetReportValidationPipe())
  async getReportByQuery(
    @Query() query: IGetReportQuery,
  ): Promise<Array<Report>> {
    return this.reportService.getReportsByQuery(query);
  }

  @Delete()
  async deleteReport(@Body('reportID') reportID: string): Promise<null> {
    await this.reportService.deleteReportByID(reportID);
    return null;
  }
}
