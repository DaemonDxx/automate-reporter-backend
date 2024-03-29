import { CellAddress, Range, WorkSheet } from 'xlsx';
import { ParseFailedError } from '../../../../utils/Errors/ParseFailed.error';
import { Departments } from '../../../../typings/departments';
import { toArray } from '../../../../utils/toArray.function';
import { XLSXHelper } from '../../../../utils/xlsx/XLSXHelper';
import { IParserStrategy } from '../parserStrategy.interface';
import {
  Electricity,
  Temperature,
  TypesValue,
  SomeValue,
} from '../../../../typings/modules/values';
import { RangeNumber } from '../../../../utils/range';
import { getKeyByValue } from '../../../../utils/valueFromEnum.function';

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
        if (!rangeMonth) continue;
        for (const department of Object.values(Departments)) {
          const rowDepartment = this.findRowByDepartment(
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
    console.log(`Итого значений ${result.length}`);
    if (this.errors.length > 0) throw new ParseFailedError(this.errors);
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

  private findRangeWithMonth(month: string): Range | null {
    for (const result of this.findCellsWithValue(month)) {
      return {
        s: result.address,
        e: {
          r: result.address.r + this.WIDTH_OFFSET_IN_MONTH,
          c: result.address.c + this.HEIGHT_OFFSET_IN_MONTH,
        },
      };
    }
    return null;
  }

  private findRowByDepartment(department: string, startRow: number): number {
    const findResult = this.findCellsWithValue(department, {
      range: {
        s: {
          c: 0,
          r: startRow
        },
        e: {
          c: 0,
          r: startRow + this.HEIGHT_OFFSET_IN_MONTH,
        },
      },
    }).next();
    if (findResult.value) {
      return findResult.value.address.r;
    } else {
      throw new Error(
        `Не найден филиал ${department}, начиная от строчки ${startRow}`,
      );
     }
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
