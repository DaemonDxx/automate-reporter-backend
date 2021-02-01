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

  getHello(): string {
    return 'Hello World!';
  }

  async parseFile(parseFileOption: ParseFileDto): Promise<Report> {
    const report = await this.Report.findById(parseFileOption.id_report);
    const buffer: Buffer = await this.fileService.getBufferOfFile(
      parseFileOption.filename,
    );
    const result: IResultParsing = this.parserService.parse({
      file: buffer,
      type: 'weekly',
    });
    const file: ParsedFile = await this.createFile(report, result.department);
    const values: Array<Value> = await this.saveValues(result, file);
  }

  private async createFile(
    report: Report,
    department: string,
  ): Promise<ParsedFile> {
    const parsedFile = new this.ParsedFile();
    parsedFile.department = department;
    parsedFile.report = report;
    parsedFile.version = await this.getNextVersionFile(report, department);
    return parsedFile.save();
  }

  private async getNextVersionFile(
    report: Report,
    department: string,
  ): Promise<number> {
    const files: Array<ParsedFile> = await this.ParsedFile.find({
      report,
      department,
    });
    if (!files) {
      return 1;
    } else {
      return files[0].version + 1;
    }
  }

  private async createReport(reportDto: CreateReportDto): Promise<Report> {
    const report = new this.Report(reportDto);
    return report.save();
  }

  private async saveValues(
    parsedResult: IResultParsing,
    fromFile: ParsedFile,
  ): Promise<Array<Value>> {
    const savedValues: Array<Value> = [];
    for (const item of parsedResult.data) {
      const description: Description = await this.findOrCreateDescription(
        item.description,
      );
      const value: Value = await new this.Value({
        fromFile,
        description,
        v: item.value,
      }).save();
      savedValues.push(value);
    }
    return savedValues;
  }

  private async findOrCreateDescription(
    description: IDescription,
  ): Promise<Description> {
    const findResult: Description = await this.Description.findOne({
      key: description.key,
    });
    if (findResult) {
      return findResult;
    } else {
      const newDescription: Description = await new this.Description(
        description,
      );
      return newDescription;
    }
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
