import { ICheckerStrategy } from './checkerStrategy.interface';
import { ParsedFile } from '../../dbModels/WeeklyModels/file.schema';
import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Value } from '../../dbModels/WeeklyModels/value.schema';
import { Description } from '../../dbModels/WeeklyModels/description.schema';
import { Report } from '../../dbModels/WeeklyModels/report.schema';
import { DescriptorWeekly } from '../../Utils/Descriptor/descriptor.weekly';

@Injectable({
  scope: Scope.REQUEST,
})
export class CheckerWeeklyStrategy implements ICheckerStrategy {
  ERROR_DESCRIPTION = 'Отрицательное недельное значение';

  constructor(
    @InjectModel('Report') private Report: Model<Report>,
    @InjectModel('Value') private Value: Model<Value>,
    @InjectModel('Description') private Description: Model<Description>,
    @InjectModel('ParsedFile') private ParsedFile: Model<ParsedFile>,
  ) {}

  async check(file: ParsedFile): Promise<Array<string>> {
    const errors: Array<string> = [];
    const beforeFile: ParsedFile = await this.findBeforeFile(file);
    if (!beforeFile) {
      return [];
    }
    const nowValues: Array<Value> = await this.getSortValuesByFile(file);
    const beforeValues: Array<Value> = await this.getSortValuesByFile(
      beforeFile,
    );
    for (let i = 0; i < nowValues.length; i++) {
      if (this.isHasErrorInValue(nowValues[i].v, beforeValues[i].v)) {
        errors.push(this.createErrorDescription(nowValues[i]));
      }
    }
    return errors;
  }

  private isHasErrorInValue(now: number, before: number): boolean {
    return now - before < 0;
  }

  private createErrorDescription(value: Value): string {
    const descriptor: DescriptorWeekly = new DescriptorWeekly();
    descriptor.setDBModel(value.description);
    return `${descriptor.createMetadata()}: (${value.v}) ${this.ERROR_DESCRIPTION}`;
  }

  private async findBeforeFile(file: ParsedFile): Promise<ParsedFile> {
    const reports: Array<Report> = await this.Report.find({
      year: file.report.year,
      month: file.report.month,
      type: file.report.type,
    }).populate('files');
    if (reports.length === 1) {
      return null;
    } else {
      reports.sort((a, b) => {
        return a.day - b.day;
      });
      const file = await this.ParsedFile.find({
        report: reports[1],
        isActive: true,
      });
      return file.length > 0 ? file[0]: null;
    }
  }

  private async getSortValuesByFile(file: ParsedFile) {
    const values: Array<Value> = await this.Value.find({
      fromFile: file,
    });
    values.sort();
    return values;
  }
}
