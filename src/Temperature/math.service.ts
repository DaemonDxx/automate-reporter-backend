import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coefficient } from './Models/coefficient';
import { ForTemperatureValue } from './Models/forTemperature.value';
import { DEPARTMENTS } from './departments.constant';
import { TYPES_VALUE } from './typesValue.enum';
import { of } from 'rxjs';

export interface CountResult {
  department: string;
  month: number;
  offset: number;
  offsetShare: number;
}

interface DataForAlgorithm {
  temp: number;
  reception: number;
  coefficient: Coefficient;
}

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
    for (let i = 0; i < this.getQuantityOfMonthForCount(values2); i++) {
      for (const department of DEPARTMENTS) {
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
        const offset: number = this.countAlgorithm(data1, data2) - data1.reception;
        const offsetShare: number = (offset * 100) / data2.reception;
        result.push({
          department,
          month: i,
          offset,
          offsetShare,
        });
      }
    }
    return result;
  }

  private async getDataForAlgorithm(
    department: string,
    year: number,
    month: number,
  ): Promise<DataForAlgorithm> {
    const temp: ForTemperatureValue = await this.TValue.findOne({
      department,
      month,
      year,
      type: TYPES_VALUE.TEMPERATURE,
    });
    const reception: ForTemperatureValue = await this.TValue.findOne({
      department,
      month,
      year,
      type: TYPES_VALUE.RECEPTION,
    });
    const coef: Coefficient = await this.Coefficient.findOne({
      department,
      maxTemp: {
        $gte: temp.value,
      },
      minTemp: {
        $lt: temp.value,
      },
    });
    return {
      coefficient: coef,
      temp: temp.value,
      reception: reception.value,
    };
  }

  private countAlgorithm(
    data1: DataForAlgorithm,
    data2: DataForAlgorithm,
  ): number {
    if (data1.coefficient.tag === data2.coefficient.tag) {
      return this.formula(
        data1.coefficient.value,
        data1.temp,
        data2.temp,
        data1.reception,
      );
    } else {
      const temp: number =
        data1.temp < data2.temp
          ? data1.coefficient.maxTemp
          : data1.coefficient.minTemp;
      let result: number = this.formula(
        data1.coefficient.value,
        data1.temp,
        temp,
        data1.reception,
      );
      result = this.formula(data2.coefficient.value, temp, data2.temp, result);
      return result;
    }
  }

  private formula(
    coef: number,
    temp1: number,
    temp2: number,
    reception: number,
  ): number {
    return reception * (1 + (coef * (temp2 - temp1)) / 100);
  }

  private getQuantityOfMonthForCount(values: ForTemperatureValue[]): number {
    const setOfMonth: Set<number> = new Set<number>();
    for (const item of values) {
      setOfMonth.add(item.month);
    }
    return setOfMonth.size;
  }
}
