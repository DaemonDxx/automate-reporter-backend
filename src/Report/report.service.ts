import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from 'src/dbModels/WeeklyModels/report.schema';
import { CreateReportDto } from '../DTO/createReport.dto';
import { IGetReportQuery } from './get.query.interface';

@Injectable()
export class ReportService {
  constructor(@InjectModel('Report') private Report: Model<Report>) {}

  async createReport(createReportDTO: CreateReportDto): Promise<Report> {
    const report: Report = await new this.Report(createReportDTO).save();
    return report;
  }

  async updateReport(report: Report): Promise<Report> {
    const { _id, ...query } = report;
    const updatedReport = await this.Report.findOneAndUpdate(
      { _id: _id },
      query,
      {
        new: true,
      },
    );
    return updatedReport;
  }

  async getReport(_idReport: string): Promise<Report> {
    return this.Report.findById(_idReport);
  }

  async getReportsByQuery(query: IGetReportQuery): Promise<Array<Report>> {
    const { limit, offset, type, ...filter } = query;
    return this.Report.find({
      type: {
        $in: type,
      },
      ...filter,
    })
      .limit(limit)
      .skip(offset)
      .sort({ dateAt: -1 });
  }

  async deleteReportByID(reportID: string) {
    return this.Report.deleteOne({
      _id: reportID,
    });
  }
}
