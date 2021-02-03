import { Injectable } from '@nestjs/common';
import { ParsedFile } from '../dbModels/WeeklyModels/file.schema';
import { CheckerWeeklyStrategy } from './CheckStategy/checker.weekly.strategy';
import { ICheckerStrategy } from './CheckStategy/checkerStrategy.interface';
import { TYPES_REPORT } from '../Utils/typesReport.constant';

@Injectable()
export class CheckerService {
  constructor(private readonly weeklyStrategy: CheckerWeeklyStrategy) {}

  private getStrategy(type: string): ICheckerStrategy {
    switch (type) {
      case TYPES_REPORT.WEEKLY:
        return this.weeklyStrategy;
    }
  }

  async checkFile(
    typeReport: string,
    file: ParsedFile,
  ): Promise<Array<string>> {
    const strategy: ICheckerStrategy = this.getStrategy(typeReport);
    return strategy.check(file);
  }
}
