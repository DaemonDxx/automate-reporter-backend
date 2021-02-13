import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { ParseFileDto } from '../DTO/parseFile.dto';
import { Report } from '../dbModels/WeeklyModels/report.schema';
import { IResultParsing } from '../Parser/resultParsing.interface';
import { ParsedFile } from '../dbModels/WeeklyModels/file.schema';
import { Value } from '../dbModels/WeeklyModels/value.schema';
import { ParserService } from '../Parser/parser.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Description } from '../dbModels/WeeklyModels/description.schema';
import { IDescription } from '../Parser/ParserStrategy/description.interface';
import { CheckerService } from '../Checker/checker.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly parserService: ParserService,
    private readonly checker: CheckerService,
    @InjectModel('Report') private Report: Model<Report>,
    @InjectModel('Value') private Value: Model<Value>,
    @InjectModel('Description') private Description: Model<Description>,
    @InjectModel('ParsedFile') private ParsedFile: Model<ParsedFile>,
  ) {}

  async getFilesByReport(reportID: string): Promise<ParsedFile[]> {
    const report = await this.Report.findById(reportID);
    return this.ParsedFile.find({ report: report });
  }

  private async getBufferOfFile(filename: string): Promise<Buffer> {
    try {
      //TODO: Разобраться с путями (лучше вынести в конфиг)
      const buffer: Buffer = fs.readFileSync(
        join(
          'C:\\Users\\Iurii\\Documents\\GitHub\\automate-reporter-backend\\uploads',
          filename,
        ),
      );
      return buffer;
    } catch (e) {
      throw new Error(e);
    }
  }

  async parseFile(parseFileOption: ParseFileDto): Promise<ParsedFile> {
    const report = await this.Report.findById(parseFileOption.id_report);
    const buffer: Buffer = await this.getBufferOfFile(parseFileOption.filename);
    const result: IResultParsing = this.parserService.parse({
      file: buffer,
      type: report.type,
    });
    await this.unActiveFileByDepartment(report, result.department);
    const file: ParsedFile = await this.saveParsedFile(
      report,
      result.department,
      parseFileOption.filename,
    );
    const values: Array<Value> = await this.saveValues(result, file);
    const errors: Array<string> = await this.checker.checkFile(
      report.type,
      file,
    );
    file.valueErrors = errors;
    return await file.save();
  }

  private async saveParsedFile(
    report: Report,
    department: string,
    filename: string,
  ): Promise<ParsedFile> {
    const parsedFile = new this.ParsedFile();
    parsedFile.department = department;
    parsedFile.report = report;
    parsedFile.version = await this.getNextVersionFile(report, department);
    parsedFile.filename = filename;
    return parsedFile.save();
  }

  private async getNextVersionFile(
    report: Report,
    department: string,
  ): Promise<number> {
    const files: Array<ParsedFile> = await this.ParsedFile.find({
      report,
      department,
    })
      .sort({ version: -1 })
      .limit(1);
    if (files.length === 0) {
      return 1;
    } else {
      return files[0].version + 1;
    }
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
      return newDescription.save();
    }
  }

  private async unActiveFileByDepartment(
    report: Report,
    department: string,
  ): Promise<void> {
    const activeFile = await this.ParsedFile.find({
      report,
      department,
      isActive: true,
    });
    if (activeFile.length > 0) {
      await this.ParsedFile.findOneAndUpdate(
        {
          _id: activeFile[0]._id,
        },
        {
          isActive: false,
        },
      );
    }
  }
}
