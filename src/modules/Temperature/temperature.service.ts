import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ForTemperatureValue } from './Models/forTemperature.value';
import { Model } from 'mongoose';
import { StorageService } from '../storage/storage.service';
import { TValue } from './Models/TValue.interface';
import { Coefficient } from './Models/coefficient';

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

  async getAccessYears(): Promise<number[]> {
    const setYears: Set<number> = new Set<number>();
    // const values: ForTemperatureValue[] = await this.Value.find({
    //   department: DEPARTMENTS[0],
    //   month: 0,
    //   type: TYPES_VALUE.RECEPTION,
    // });
    // for (const value of values) {
    //   setYears.add(value.year);
    // }
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
