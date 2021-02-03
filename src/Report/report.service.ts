import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from 'src/dbModels/WeeklyModels/report.schema';
import { CreateReportDto } from '../DTO/createReport.dto';

@Injectable()
export class ReportService {
  constructor(@InjectModel('Report') private Report: Model<Report>) {}

  async createReport(createReportDTO: CreateReportDto): Promise<Report> {
    const report: Report = await new this.Report(createReportDTO).save();
    return report;
  }

  async updateReport(report: Report): Promise<Report> {
    return this.Report.findByIdAndUpdate(report.id, report);
  }

  async getReport(_idReport: string): Promise<Report> {
    return this.Report.findById(_idReport);
  }
}
