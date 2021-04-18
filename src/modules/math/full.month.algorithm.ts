import { Data$OffsetSolver } from '../../typings/modules/math/offset.personal';

export class FullMonthAlgorithm {
  static solve(before: Data$OffsetSolver, now: Data$OffsetSolver): number {
    if (before.coefficient.v === now.coefficient.v) {
      return (
        this.formula(
          before.coefficient.v,
          before.temperature,
          now.temperature,
          before.reception,
        ) - before.reception
      );
    } else {
      const temp: number =
        before.temperature < now.temperature
          ? before.coefficient.maxTemp
          : before.coefficient.minTemp;
      let result: number = this.formula(
        before.coefficient.v,
        before.temperature,
        temp,
        before.reception,
      );
      result =
        this.formula(now.coefficient.v, temp, now.temperature, result) -
        before.reception;
      return result;
    }
  }

  private static formula(
    coef: number,
    temp1: number,
    temp2: number,
    reception: number,
  ): number {
    return reception * (1 + (coef * (temp2 - temp1)) / 100);
  }
}
