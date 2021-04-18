import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Value } from '../value/schemas/value.schema';
import { Model } from 'mongoose';
import { SomeValueModel } from '../value/value.service';
import { Data$OffsetSolver, Query$OffsetsByYear } from '../../typings/modules/math/offset.personal';
import { Coefficient, Temperature, TypesValue } from '../../typings/modules/values';
import { Departments } from '../../typings/departments';
import { FilteredDataByMonth, FilteredDataByYear, Offset } from '../../typings/modules/math/offset';
import { FullMonthAlgorithm } from './full.month.algorithm';

@Injectable()
export class MathService {
  constructor(
    @InjectModel(Value.name) private readonly Value: Model<SomeValueModel>,
  ) {}

  async solveOffsetsByYear({
    yearBefore,
    yearNow,
  }: Query$OffsetsByYear): Promise<Offset> {
    const values: SomeValueModel[] = await this.Value.find({
      type: {
        $in: [TypesValue.Temperature, TypesValue.Reception],
      },
      year: {
        $in: [yearBefore, yearNow],
      },
    });
    const coefficients = await this.getCoefficientsByTemperature(
      values.filter(
        (item) => item.type === TypesValue.Temperature,
      ) as Temperature[],
    );
    const;
  }

  private async preparationData({
    yearBefore,
    yearNow,
  }: Query$OffsetsByYear): Promise<SomeValueModel[]> {

    const temperature: SomeValueModel[] = await this.Value.find({
      type: TypesValue.Temperature,
      year: {
        $in: [yearBefore, yearNow],
      },
    });
    const : Partial<Data$OffsetSolver> = await this.getCoefficientsByTemperature(
      temperature as Temperature[],
    );
    return [...values, ...coefficients];
  }


  private async getCoefficientsByTemperature(
    values: Temperature[],
  ): Promise<Partial<Data$OffsetSolver>> {
    const result: Promise<Partial<Data$OffsetSolver>>[] = [];
    for (const temperature of values) {
        this.Value.findOne({
          department: temperature.department,
          type: TypesValue.Constant,
          maxTemp: {
            $gte: temperature.v,
          },
          minTemp: {
            $lt: temperature.v,
          },
        }).then((coefficient) => {

        });
    }
    return Promise.all(result);
  }

  private filterValue(values: SomeValueModel[]): FilteredDataByYear {
    const result: FilteredDataByYear = new Map<number, FilteredDataByMonth>();
    for (const item of values) {
      if (result.has(item.))
    }
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
