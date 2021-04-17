import { DataForAlgorithm } from './interfaces/dataForAlgorithm.interface';

export class FullMonthAlgorithm {
  static solve(data1: DataForAlgorithm, data2: DataForAlgorithm): number {
    if (data1.coefficient.tag === data2.coefficient.tag) {
      return (
        this.formula(
          data1.coefficient.value,
          data1.temp,
          data2.temp,
          data1.reception,
        ) - data1.reception
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
      result =
        this.formula(data2.coefficient.value, temp, data2.temp, result) -
        data1.reception;
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
