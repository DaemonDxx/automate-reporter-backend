import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coefficient } from './Models/coefficient';
import { ForTemperatureValue } from './Models/forTemperature.value';
import { FullMonthAlgorithm } from './Math/full.month.algorithm';
import { DataForAlgorithm } from './Math/interfaces/dataForAlgorithm.interface';
import { Offset } from './Math/interfaces/offset.interface';
import { CountResult } from './Math/interfaces/countResult.interface';
import { toArray } from '../../../utils/toArray.function';
import { Departments } from '../../../typings/departments';

@Injectable()
export class MathService {
  constructor(
    @InjectModel('Coefficient') private Coefficient: Model<Coefficient>,
    @InjectModel('TValue') private TValue: Model<ForTemperatureValue>,
  ) {}

  async countOffset(
    yearCompare1: number,
    yearCompare2: number,
  ): Promise<CountResult[]> {
    const result: CountResult[] = [];
    const values2: ForTemperatureValue[] = await this.TValue.find({
      year: yearCompare2,
    });
    for (const department of toArray(Departments)) {
      const offsetsOfDepartment: Offset[] = [];
      for (let i = 0; i < this.getQuantityOfMonthForCount(values2); i++) {
        const data1: DataForAlgorithm = await this.getDataForAlgorithm(
          department,
          yearCompare1,
          i,
        );
        const data2: DataForAlgorithm = await this.getDataForAlgorithm(
          department,
          yearCompare2,
          i,
        );
        const offset: number = FullMonthAlgorithm.solve(data1, data2);
        offsetsOfDepartment.push({
          month: i,
          offset,
          receptionBefore: data1.reception,
          receptionNow: data2.reception,
          tempBefore: data1.temp,
          tempNow: data2.temp,
        });
      }
      result.push({
        department,
        offsets: offsetsOfDepartment,
      });
    }
    return result;
  }

  private async getDataForAlgorithm(
    department: string,
    year: number,
    month: number,
  ): Promise<DataForAlgorithm> {
    const findResult: ForTemperatureValue[] = await this.TValue.find({
      department,
      month,
      year,
    });
    let temp: number;
    let reception: number;
    if (findResult[0].type === '') {
      temp = findResult[0].value;
      reception = findResult[1].value;
    } else {
      temp = findResult[1].value;
      reception = findResult[0].value;
    }
    const coef: Coefficient = await this.Coefficient.findOne({
      department,
      maxTemp: {
        $gte: temp,
      },
      minTemp: {
        $lt: temp,
      },
    });
    return {
      coefficient: coef,
      temp: temp,
      reception: reception,
    };
  }

  private getQuantityOfMonthForCount(values: ForTemperatureValue[]): number {
    const setOfMonth: Set<number> = new Set<number>();
    for (const item of values) {
      setOfMonth.add(item.month);
    }
    return setOfMonth.size;
  }
}
