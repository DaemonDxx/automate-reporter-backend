import { CellAddress, WorkSheet, Range, CellObject, utils } from 'xlsx';
import { TValue } from '../Models/TValue.interface';
import { ParseOptions } from './parse.options';
import { TYPES_VALUE } from '../typesValue.enum';

export class TemperatureFactorStrategy {
  private DEPARTMENTS = [
    '"Алтайэнерго"',
    '"Бурятэнерго"',
    '"ГАЭС"',
    '"Красноярскэнерго"',
    '"Кузбассэнерго-РЭС"',
    '"Омскэнерго"',
    '"Хакасэнерго"',
    '"Читаэнерго"',
    'АО "Тываэнерго"',
  ];

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

  private MAX_ROW = 200;
  private MAX_COLUMN = 200;

  constructor(private readonly sh: WorkSheet) {
    this.sh = sh;
  }

  parse(options: ParseOptions): TValue[] {
    this.calculateConstant(options);
    const result: TValue[] = [];
    for (const month of this.MONTHS) {
      const rangeMonth: Range = this.findRangeWithMonth(month);
      for (const department of this.DEPARTMENTS) {
        const rowDepartment: number = this.findRowByDepartment(
          department,
          rangeMonth.s.r,
        );
        for (let year = options.yearStart; year <= options.yearEnd; year++) {
          const addressYear: CellAddress = this.findCellWithYear(
            year,
            rangeMonth.s.r + 1,
            rangeMonth.s.c,
          );
          result.push({
            department: department,
            month: this.MONTHS.indexOf(month),
            year: year,
            type: TYPES_VALUE.RECEPTION,
            value: this.sh[
              utils.encode_cell({ r: rowDepartment, c: addressYear.c })
            ].v,
          });
          result.push({
            department: department,
            month: this.MONTHS.indexOf(month),
            year: year,
            type: TYPES_VALUE.TEMPERATURE,
            value: this.sh[
              utils.encode_cell({ r: rowDepartment, c: addressYear.c + 1 })
            ].v,
          });
        }
      }
    }
    return result;
  }

  private calculateConstant(options: ParseOptions) {
    this.WIDTH_OFFSET_IN_MONTH = (options.yearEnd - options.yearStart + 1)*2;
  }

  private findRangeWithMonth(month: string): Range {
    const addressMonth: CellAddress = this.findCellInRange(month, {
      s: {
        r: 1,
        c: 1,
      },
      e: {
        r: this.MAX_ROW,
        c: this.MAX_COLUMN,
      },
    });
    return {
      s: addressMonth,
      e: {
        r: addressMonth.r + this.WIDTH_OFFSET_IN_MONTH,
        c: addressMonth.c + this.HEIGHT_OFFSET_IN_MONTH,
      },
    };
  }

  private findRowByDepartment(department: string, startRow: number): number {
    for (let r = startRow; r <= startRow + this.HEIGHT_OFFSET_IN_MONTH; r++) {
      const cell: CellObject = this.sh[
        utils.encode_cell({ r, c: this.COLUMN_DEPARTMENT })
      ];
      if (this.cellValueToString(cell?.v) === department) {
        return r;
      }
    }
    throw new Error(`Не найден филиал ${department} от строчки ${startRow}`);
  }

  private cellValueToString(v: any): string {
    if (!v) {
      return '';
    } else {
      const result: string = <string>v;
      return result.trim();
    }
  }

  private findCellWithYear(
    year: number,
    row: number,
    startColumn: number,
  ): CellAddress {
    return this.findCellInRange(year.toString(), {
      s: {
        r: row,
        c: startColumn,
      },
      e: {
        r: row,
        c: startColumn + this.WIDTH_OFFSET_IN_MONTH,
      },
    });
  }

  private findCellInRange(query: string, range: Range): CellAddress {
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cell: CellObject = this.sh[utils.encode_cell({ r, c })];
        if (cell?.v == query) return { r, c };
      }
    }
    return null;
  }
}
