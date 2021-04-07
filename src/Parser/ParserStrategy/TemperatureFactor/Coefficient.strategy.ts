import { CellObject, utils, WorkSheet } from 'xlsx';
import { IParserStrategy } from '../parserStrategy.interface';
import { Coefficient, TypesValue } from '../../../Typings/Values';
import { XLSXHelper } from '../../../Utils/xlsx/XLSXHelper';
import { toArray } from '../../../Utils/toArray.function';
import { Departments } from '../../../Typings/departments';
import { getKeyByValue } from '../../../Utils/valueFromEnum.function';

export class CoefficientStrategy extends XLSXHelper implements IParserStrategy {
  OFFSET_ROW_MIN_TEMP = 0;
  OFFSET_ROW_MAX_TEMP = 1;
  OFFSET_ROW_COEFFICIENT = 2;

  COLUMN_START_TAG = 2;
  COLUMN_DEPARTMENT = 0;

  ROW_TAG = 1;

  ROW_MAX = 30;

  ws: WorkSheet;
  errors: Error[];

  constructor() {
    super();
  }

  parse(ws: WorkSheet): Coefficient[] {
    this.ws = ws;
    const result: Coefficient[] = [];
    this.COLUMN_START_TAG = this.findStartTagColumn();
    for (const department of toArray(Departments)) {
      const rowDepartment: number = this.findRowDepartment(department);
      const c = this.COLUMN_START_TAG;
      for (let c = this.COLUMN_START_TAG; c <= this.COLUMN_START_TAG + 6; c++) {
        const cell: CellObject = this.ws[
          utils.encode_cell({ r: rowDepartment, c })
        ];

        if (!isNaN(parseFloat(<string>cell?.v))) {
          const tag = this.getStringByCell({ r: 0, c });
          const value = this.getFloatByCell({
            r: rowDepartment + this.OFFSET_ROW_COEFFICIENT,
            c,
          });
          const minTemp = this.getFloatByCell({
            r: rowDepartment + this.OFFSET_ROW_MIN_TEMP,
            c,
          });
          const maxTemp = this.getFloatByCell({
            r: rowDepartment + this.OFFSET_ROW_MAX_TEMP,
            c,
          });
          result.push({
            type: TypesValue.Constant,
            department: Departments[getKeyByValue(Departments, department)],
            description: tag,
            v: value,
            minTemp,
            maxTemp,
          });
        } else {
          break;
        }
      }
    }
    console.table(result);
    return result;
  }

  private findStartTagColumn(): number {
    for (const result of this.findCellsWithValue('I')) {
      return result.address.c;
    }
    this.errors.push(new Error('Не найден столбец с содержимым "I"'));
  }

  private findRowDepartment(department: string): number {
    for (const result of this.findCellsWithValue(department)) {
      if (result) {
        return result.address.r;
      } else {
        this.errors.push(new Error(`Не найден филиал ${department}`));
        return null;
      }
    }
  }
}
