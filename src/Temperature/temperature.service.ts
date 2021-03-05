import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
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
import { FileNotFoundError } from '../Utils/Errors/FileNotFound.error';

export interface SaveValuesStatistic {
  saved: number;
  updated: number;
  payloadSave?: ForTemperatureValue[];
  payloadUpdate?: ForTemperatureValue[];
}

@Injectable()
export class TemperatureService {
  constructor(
    @InjectModel('TValue') private Value: Model<ForTemperatureValue>,
    @InjectModel('Coefficient') private CoefficientModel: Model<Coefficient>,
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly storage: StorageService,
  ) {}

  async parseFromFile(
    parseDTO: ParseFromFileDTO,
  ): Promise<SaveValuesStatistic> {
    const { isUpdateOldValue, ...parseOption } = parseDTO.options;
    const ws: WorkSheet = await this.getWorkSheet(parseDTO.filename, 'Анализ');
    const parser: TemperatureFactorStrategy = new TemperatureFactorStrategy(ws);
    const parsedValues: TValue[] = parser.parse(parseOption);
    return await this.saveValues(parsedValues, isUpdateOldValue);
  }

  private async getWorkSheet(filename, sheetName: string): Promise<WorkSheet> {
    const file: Buffer = await this.storage.getBufferOfFile(filename);
    const wb: WorkBook = read(file, { type: 'buffer' });
    const ws: WorkSheet = wb.Sheets[sheetName];
    if (!ws)
      throw new Error(
        `Страницы ${sheetName} в файле ${filename} не существует`,
      );
    return ws;
  }

  private async saveValues(
    values: TValue[],
    isUpdateOldValue: boolean,
    isReturnFullStatistic = false,
  ): Promise<SaveValuesStatistic> {
    const resultSave: ForTemperatureValue[] = [];
    const resultUpdate: ForTemperatureValue[] = [];
    for (const item of values) {
      const { value, ...query } = item;
      const oldValueModel: ForTemperatureValue = await this.Value.findOne(
        query,
      );
      if (oldValueModel && isUpdateOldValue) {
        try {
          resultUpdate.push(await this.updateValue(item, oldValueModel));
        } catch (e) {
          this.logger.error(`Значение не обновлено `);
        }
      } else if (!oldValueModel) {
        try {
          resultSave.push(await this.createValue(item));
        } catch (e) {
          this.logger.error(
            `Значение не сохранено: ${item.department} ${item.year} ${item.month} ${item.type}`,
          );
        }
      }
    }
    const statistic: SaveValuesStatistic = {
      saved: resultSave.length,
      updated: resultUpdate.length,
    };
    if (isReturnFullStatistic) {
      statistic.payloadSave = resultSave;
      statistic.payloadUpdate = resultUpdate;
    }
    return statistic;
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
    const values: ForTemperatureValue[] = await this.Value.find({
      department: DEPARTMENTS[0],
      month: 0,
      type: TYPES_VALUE.RECEPTION,
    });
    for (const value of values) {
      setYears.add(value.year);
    }
    return Array.from(setYears);
  }

  async getValue(year: number, month: number): Promise<ForTemperatureValue[]> {
    const values: ForTemperatureValue[] = await this.Value.find({
      year,
      month,
    });
    return values;
  }

  async createValue(
    newValue: TValue,
    isCheck = false,
  ): Promise<ForTemperatureValue> {
    if (isCheck) {
      const { value, ...query } = newValue;
      const oldValue = await this.Value.findOne(query);
      if (oldValue) return oldValue;
    }
    const savedValue: ForTemperatureValue = await new this.Value(
      newValue,
    ).save();
    return savedValue;
  }

  async updateValue(
    updatedValue: TValue,
    dbValue?: ForTemperatureValue,
  ): Promise<ForTemperatureValue> {
    if (dbValue) {
      dbValue.value = updatedValue.value;
      return await dbValue.save();
    } else {
      const { value, ...query } = updatedValue;
      const oldValue = await this.Value.findOne(query);
      if (!oldValue) throw new Error('Данного значения не существует');
      oldValue.value = value;
      return await oldValue.save();
    }
  }
}
