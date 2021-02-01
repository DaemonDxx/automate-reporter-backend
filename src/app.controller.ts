import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateReportDto } from './DTO/createReport.dto';
import { Report } from './dbModels/WeeklyModels/report.schema';
import { ParseFileDto } from './DTO/parseFile.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/file')
  async parseFile(
    @Body() parseFileOption: ParseFileDto,
    filename: string,
  ): Promise<Report> {
    const report = await this.appService.parseFile(parseFileOption);
    return report;
  }

  @Post('/report')
  async createReport(@Body() reportDto: CreateReportDto): Promise<Report> {
    const report: Report = await this.appService.createReport(reportDto);
    return report;
  }
}
