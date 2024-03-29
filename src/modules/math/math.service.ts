import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Value } from '../value/schemas/value.schema';
import { Model } from 'mongoose';
import { SomeValueModel } from '../value/value.service';
import {
  Data$OffsetSolver,
  Query$OffsetsByYear,
} from '../../typings/modules/math/offset.personal';
import {
  Coefficient,
  Electricity,
  TypesValue,
} from '../../typings/modules/values';
import { Departments } from '../../typings/departments';
import {
  ComparedData,
  OffsetType,
  PreparedData,
} from '../../typings/modules/math/offsetType';
import { FullMonthAlgorithm } from './full.month.algorithm';
import { of } from 'rxjs';

@Injectable()
export class MathService {
  constructor(
    @InjectModel(Value.name) private readonly Value: Model<SomeValueModel>,
  ) {}

  async getOffsets({
    yearBefore,
    yearNow,
  }: Query$OffsetsByYear): Promise<OffsetType[]> {
    const receptionBefore: SomeValueModel[] = await this.Value.find({
      type: TypesValue.Reception,
      year: yearBefore,
    });

    if (receptionBefore.length === 0)
      throw new Error('Отсутствуют данные по за данный период');

    const result: OffsetType[] = [];

    for (const reception of receptionBefore) {
      try {
        const data = await this.prepareData(
          reception as Electricity,
          yearBefore,
          yearNow,
        );
        if (data) {
          result.push(data);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    return result;
  }

  private async prepareData(
    reception: Electricity,
    yearBefore,
    yearNow,
  ): Promise<OffsetType> {
    const offset: Partial<OffsetType> = {};
    offset.month = reception.month;
    offset.department = reception.department;
    offset.receptionBefore = reception.v;

    const tempBefore = await this.Value.findOne({
      department: reception.department,
      type: TypesValue.Temperature,
      year: yearBefore,
      month: reception.month,
    });

    if (!tempBefore)
      throw new Error(`Нет данных о температуре за ${yearBefore} год`);

    const tempNow = await this.Value.findOne({
      department: reception.department,
      type: TypesValue.Temperature,
      year: yearNow,
      month: reception.month,
    });

    if (!tempNow) throw new Error(`Нет данных о температуре за ${yearNow} год`);

    const coefficientBefore = await this.Value.findOne({
      department: reception.department,
      type: TypesValue.Constant,
      maxTemp: {
        $gte: tempBefore.v,
      },
      minTemp: {
        $lt: tempBefore.v,
      },
    });

    if (!coefficientBefore)
      throw new Error(
        `Не найден коэффициент для температуры ${tempBefore} для филиала ${reception.department}`,
      );

    const coefficientNow = await this.Value.findOne({
      department: reception.department,
      type: TypesValue.Constant,
      maxTemp: {
        $gte: tempNow.v,
      },
      minTemp: {
        $lt: tempNow.v,
      },
    });

    if (!coefficientNow)
      throw new Error(
        `Не найден коэффициент для температуры ${tempNow} для филиала ${reception.department}`,
      );

    const receptionNow = await this.Value.findOne({
      department: reception.department,
      type: TypesValue.Reception,
      year: yearNow,
      month: reception.month,
    });

    if (!receptionNow)
      throw new Error(
        `Не найден отпуск в сеть за ${offset.month} месяц для филиала ${reception.department}`,
      );

    offset.offset = this.solveOffset(
      {
        coefficient: coefficientBefore as Coefficient,
        reception: reception.v,
        temperature: tempBefore.v,
      },
      {
        coefficient: coefficientNow as Coefficient,
        reception: receptionNow.v,
        temperature: tempNow.v,
      },
    );

    offset.receptionNow = receptionNow.v;
    offset.temperatureNow = tempNow.v;
    offset.temperatureBefore = tempBefore.v;

    return offset as OffsetType;
  }

  solveOffset(before: Data$OffsetSolver, now: Data$OffsetSolver): number {
    return FullMonthAlgorithm.solve(before, now);
  }

  async findCoefficient(
    temperature: number,
    department: Departments,
  ): Promise<Coefficient> {
    const coefficient: SomeValueModel = await this.Value.findOne({
      type: TypesValue.Constant,
      maxTemp: {
        $gte: temperature,
      },
      minTemp: {
        $lt: temperature,
      },
      department,
    });
    return <Coefficient>coefficient;
  }
}
