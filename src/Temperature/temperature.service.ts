import { Injectable } from '@nestjs/common';
import { ParseFromFileDTO } from './DTO/ParseFromFile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ForTemperatureValue } from './Models/forTemperature.value';
import { Model } from 'mongoose';
import { TemperatureFactorStrategy } from './Parser/TemperatureFactor.strategy';
import { StorageService } from '../Storage/storage.service';
import { WorkBook, read, WorkSheet } from 'xlsx';
import { TValue } from './Models/TValue.interface';
import { CoefficientStrategy } from './Parser/Coefficient.strategy';
import { ICoefficient } from './Models/coefficient.interface';
import { Coefficient } from './Models/coefficient';
import { DEPARTMENTS } from './departments.constant';
import { TYPES_VALUE } from './typesValue.enum';

export interface ParsedStatistic {
  saved: number;
  updated: number;
}

@Injectable()
export class TemperatureService {
  constructor(
    @InjectModel('TValue') private tValueModel: Model<ForTemperatureValue>,
    @InjectModel('Coefficient') private CoefficientModel: Model<Coefficient>,
    private readonly storage: StorageService,
  ) {}

  async parseFromFile(parseDTO: ParseFromFileDTO) {
    const { isUpdateOldValue, ...parseOption } = parseDTO.options;
    const parser: TemperatureFactorStrategy = new TemperatureFactorStrategy(
      await this.getWorkSheet(parseDTO.filename, 'Анализ'),
    );
    const parsedValues: TValue[] = parser.parse(parseOption);
    return await this.saveValues(parsedValues, isUpdateOldValue);
  }

  private async getWorkSheet(filename, sheetName: string): Promise<WorkSheet> {
    const file: Buffer = await this.storage.getBufferOfFile(filename);
    const wb: WorkBook = read(file, { type: 'buffer' });
    return wb.Sheets[sheetName];
  }

  private async saveValues(
    values: TValue[],
    isUpdateOldValue: boolean,
  ): Promise<ParsedStatistic> {
    const resultSave: ForTemperatureValue[] = [];
    const resultUpdate: ForTemperatureValue[] = [];
    for (const item of values) {
      const oldValueModel: ForTemperatureValue = await this.tValueModel.findOne(
        item,
      );
      if (oldValueModel && isUpdateOldValue) {
        oldValueModel.value = item.value;
        resultUpdate.push(
          await oldValueModel.save({
            safe: true,
          }),
        );
      } else {
        const db_value: ForTemperatureValue = await new this.tValueModel(
          item,
        ).save();
        resultSave.push(db_value);
      }
    }
    return {
      saved: resultSave.length,
      updated: resultUpdate.length,
    };
  }

  async parseCoefficientFromFile(filename): Promise<Map<string, number>> {
    const file: WorkSheet = await this.getWorkSheet(filename, 'Table 1');
    const parser: CoefficientStrategy = new CoefficientStrategy(file);
    const result: ICoefficient[] = parser.parse();
    const count: Map<string, number> = await this.saveCoefficient(result);
    return count;
  }

  async saveCoefficient(coeff: ICoefficient[]): Promise<Map<string, number>> {
    const resultCounter: Map<string, number> = new Map<string, number>();
    for (const item of coeff) {
      const coeff_db = await this.CoefficientModel.findOneAndUpdate(
        {
          department: item.department,
          tag: item.tag,
        },
        item,
        { upsert: true },
      );
      if (resultCounter.has(item.department)) {
        const count = resultCounter.get(item.department);
        resultCounter.set(item.department, count + 1);
      } else {
        resultCounter.set(item.department, 1);
      }
    }
    return resultCounter;
  }

  async getAccessYears(): Promise<number[]> {
    const setYears: Set<number> = new Set<number>();
    const values: ForTemperatureValue[] = await this.tValueModel.find({
      department: DEPARTMENTS[0],
      month: 0,
      type: TYPES_VALUE.RECEPTION,
    });
    for (const value of values) {
      setYears.add(value.year);
    }
    return Array.from(setYears);
  }
}
