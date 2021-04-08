import { CellAddress, Range, WorkSheet } from 'xlsx';
import { ParseFailedError } from '../../../Utils/Errors/ParseFailed.error';
import { Departments } from '../../../Typings/departments';
import { toArray } from '../../../Utils/toArray.function';
import { XLSXHelper } from '../../../Utils/xlsx/XLSXHelper';
import { IParserStrategy } from '../parserStrategy.interface';
import {
  Electricity,
  Temperature,
  TypesValue,
  SomeValue,
} from '../../../Typings/Modules/Values';
import { RangeNumber } from '../../../Utils/range';
import { getKeyByValue } from '../../../Utils/valueFromEnum.function';

export class TemperatureFactorStrategy
  extends XLSXHelper
  implements IParserStrategy {
  private MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  //количество лет, которые указаны в файле
  private WIDTH_OFFSET_IN_MONTH: number;
  //Количество строк между началам таблицы месяца и концом
  private HEIGHT_OFFSET_IN_MONTH = 23;
  //Столбец с названиями филиала
  private COLUMN_DEPARTMENT = 0;

  private errors: Error[] = [];

  parse(ws: WorkSheet): SomeValue[] {
    this.ws = ws;
    const rangeOfYears = this.findRangeOfYear();
    this.calculateConstant(rangeOfYears);
    const result: SomeValue[] = [];
    const errorsParse: Error[] = [];
    for (const month of this.MONTHS) {
      try {
        const rangeMonth: Range = this.findRangeWithMonth(month);
        for (const department of Object.values(Departments)) {
          const rowDepartment: number = this.findRowByDepartment(
            department,
            rangeMonth.s.r,
          );
          for (const year of rangeOfYears) {
            const addressYear: CellAddress = this.findCellWithYear(
              year,
              rangeMonth.s.r + 1,
              rangeMonth.s.c,
            );
            if (!this.getStringByCell({ r: rowDepartment, c: addressYear.c }))
              continue;

            const t: Temperature = {
              type: TypesValue.Temperature,
              description: 'Температура',
              department: Departments[getKeyByValue(Departments, department)],
              month: this.MONTHS.indexOf(month),
              year,
              v: this.getFloatByCell({
                r: rowDepartment,
                c: addressYear.c + 1,
              }),
            };
            const r: Electricity = {
              type: TypesValue.Reception,
              description: 'Отпуск в сеть',
              department: Departments[getKeyByValue(Departments, department)],
              month: this.MONTHS.indexOf(month),
              year,
              v: this.getFloatByCell({ r: rowDepartment, c: addressYear.c }),
            };
            result.push(...[t, r]);
          }
        }
      } catch (e) {
        console.trace(e);
        this.errors.push(e);
      }
    }
    console.table(result);
    if (errorsParse.length > 0) throw new ParseFailedError(errorsParse);
    return result;
  }

  private findRangeOfYear(): RangeNumber {
    let from: number;
    let to: number;

    const range = new RangeNumber(2014, 2030);
    for (const year of range) {
      for (const result of this.findCellsWithValue(year)) {
        if (!from) {
          from = parseInt(<string>result.cell.v);
          break;
        } else {
          to = parseInt(<string>result.cell.v);
        }
        break;
      }
    }
    return new RangeNumber(from, to);
  }

  private calculateConstant(range: RangeNumber) {
    this.WIDTH_OFFSET_IN_MONTH = (range.to - range.from + 1) * 2;
  }

  private findRangeWithMonth(month: string): Range {
    for (const result of this.findCellsWithValue(month)) {
      return {
        s: result.address,
        e: {
          r: result.address.r + this.WIDTH_OFFSET_IN_MONTH,
          c: result.address.c + this.HEIGHT_OFFSET_IN_MONTH,
        },
      };
    }
    this.errors.push(new Error(`В файле отсутствует месяц ${month}`));
  }

  private findRowByDepartment(department: string, startRow: number): number {
    for (const result of this.findCellsWithValue(department, {
      range: {
        s: {
          r: startRow,
          c: this.COLUMN_DEPARTMENT,
        },
        e: {
          r: startRow + this.HEIGHT_OFFSET_IN_MONTH,
          c: this.COLUMN_DEPARTMENT,
        },
      },
    })) {
      return result.address.r;
    }
    this.errors.push(
      new Error(`Не найден филиал ${department} от строчки ${startRow}`),
    );
  }

  private findCellWithYear(
    year: number,
    row: number,
    startColumn: number,
  ): CellAddress {
    for (const result of this.findCellsWithValue(year.toString(), {
      range: {
        s: {
          r: row,
          c: startColumn,
        },
        e: {
          r: row,
          c: startColumn + this.WIDTH_OFFSET_IN_MONTH,
        },
      },
    })) {
      return result.address;
    }
    this.errors.push(
      new Error(`Не найден год ${year} от столбца ${startColumn}`),
    );
  }
}
