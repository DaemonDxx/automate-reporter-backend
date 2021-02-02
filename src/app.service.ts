import { Injectable } from '@nestjs/common';
import { IResultParsing } from './parser/resultParsing.interface';
import { Report } from './dbModels/WeeklyModels/report.schema';
import { Description } from './dbModels/WeeklyModels/description.schema';
import { IDescription } from './parser/ParserStrategy/description.interface';
import IValue from './parser/ParserStrategy/value.interface';
import { ErrorOfFile } from './dbModels/WeeklyModels/error.schema';
import { ParserService } from './parser/parser.service';
import { FilesService } from './files/files.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Value } from './dbModels/WeeklyModels/value.schema';
import { CreateReportDto } from './DTO/createReport.dto';
import { ParsedFile } from './dbModels/WeeklyModels/file.schema';
import { ParseFileDto } from './DTO/parseFile.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly parserService: ParserService,
    private readonly fileService: FilesService,
    @InjectModel('Report') private Report: Model<Report>,
    @InjectModel('Value') private Value: Model<Value>,
    @InjectModel('ErrorOfReport') private ErrorOfReport: Model<ErrorOfFile>,
    @InjectModel('Description') private Description: Model<Description>,
    @InjectModel('ParsedFile') private ParsedFile: Model<ParsedFile>,
  ) {}

  private async createReport(reportDto: CreateReportDto): Promise<Report> {
    const report = new this.Report(reportDto);
    return report.save();
  }

  private async updateFilesInReport(
    report: Report,
    file: ParsedFile,
  ): Promise<Report> {}

  private async checkErrors(file: ParsedFile): Promise<Array<string>> {
    const currentValues: Array<Value> = await this.Value.find({
      fromFile: file,
    }).populate('Description');
  }

  private checkNegativeValue(values: Array<Value>): Array<string> {
    const errors: Array<string> = [];
    values.forEach((item) => {
      if (item.v < 0) {
        errors.push(
          this.createErrorDescription(item, 'Отрицательное значение'),
        );
      }
    });
    return errors;
  }

  private createErrorDescription(value: Value, message: string): string {
    return `${value.description.department} - ${value.description.branch} - ${value.description.consumer} - ${value.description.year}: (${value.v}) ${message}`;
  }
}
