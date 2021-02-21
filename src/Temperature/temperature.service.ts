import { Injectable } from '@nestjs/common';
import { ParseFromFileDTO } from './DTO/ParseFromFile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ForTemperatureValue } from './Models/forTemperature.value';
import { Model } from 'mongoose';
import { TemperatureFactorStrategy } from './Parser/TemperatureFactor.strategy';
import { StorageService } from '../Storage/storage.service';
import { WorkBook, read, WorkSheet } from 'xlsx';
import { TValue } from './Models/TValue.interface';

export interface ParsedStatistic {
  saved: number;
  updated: number;
}

@Injectable()
export class TemperatureService {
  constructor(
    @InjectModel('TValue') private tValueModel: Model<ForTemperatureValue>,
    private readonly storage: StorageService,
  ) {}

  async parseFromFile(parseDTO: ParseFromFileDTO) {
    const { isUpdateOldValue, ...parseOption } = parseDTO.options;
    const parser: TemperatureFactorStrategy = new TemperatureFactorStrategy(
      await this.getWorkSheet(parseDTO.filename),
    );
    const parsedValues: TValue[] = parser.parse(parseOption);
    return await this.saveValues(parsedValues, isUpdateOldValue);
  }

  private async getWorkSheet(filename): Promise<WorkSheet> {
    const file: Buffer = await this.storage.getBufferOfFile(filename);
    const wb: WorkBook = read(file, { type: 'buffer' });
    return wb.Sheets['Анализ'];
  }

  private async saveValues(
    values: TValue[],
    isUpdateOldValue: boolean,
  ): Promise<ParsedStatistic> {
    const resultSave: ForTemperatureValue[] = [];
    const resultUpdate: ForTemperatureValue[] = [];
    for (const item of values) {
      const oldValueModel: ForTemperatureValue = await this.tValueModel.findOne(item);
      if (oldValueModel && isUpdateOldValue) {
        oldValueModel.value = item.value;
        resultUpdate.push(
          await oldValueModel.save({
            safe: true,
          }),
        );
      } else {
        const db_value: ForTemperatureValue = await new this.tValueModel(item).save();
        resultSave.push(db_value);
      }
    }
    return {
      saved: resultSave.length,
      updated: resultUpdate.length,
    };
  }
}
