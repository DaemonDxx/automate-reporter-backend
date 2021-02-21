import { CellObject, WorkSheet, utils } from 'xlsx';
import { DEPARTMENTS } from '../departments.constant';
import { ICoefficient } from '../Models/coefficient.interface';

export class CoefficientStrategy {
  OFFSET_ROW_MIN_TEMP = 0;
  OFFSET_ROW_MAX_TEMP = 1;
  OFFSET_ROW_COEFFICIENT = 2;

  COLUMN_START_TAG = 2;
  COLUMN_DEPARTMENT = 0;

  ROW_TAG = 1;

  ROW_MAX = 30;

  constructor(private readonly sh: WorkSheet) {}

  parse(): ICoefficient[] {
    const result: ICoefficient[] = [];
    for (const department of DEPARTMENTS) {
      const rowDepartment: number = this.findRowDepartment(department);
      const c = this.COLUMN_START_TAG;
      for (let c = this.COLUMN_START_TAG; c <= this.COLUMN_START_TAG + 6; c++) {
        const cell: CellObject = this.sh[
          utils.encode_cell({ r: rowDepartment, c })
        ];
        if (cell?.v) {
          result.push({
            department: department,
            tag: this.sh[utils.encode_cell({ r: 0, c })].v,
            value: parseFloat(
              this.sh[
                utils.encode_cell({
                  r: rowDepartment + this.OFFSET_ROW_COEFFICIENT,
                  c,
                })
              ].v,
            ),
            minTemp: this.sh[
              utils.encode_cell({
                r: rowDepartment + this.OFFSET_ROW_MIN_TEMP,
                c,
              })
            ].v,
            maxTemp: this.sh[
              utils.encode_cell({
                r: rowDepartment + this.OFFSET_ROW_MAX_TEMP,
                c,
              })
            ].v,
          });
        } else {
          break;
        }
      }
    }
    return result;
  }

  private findRowDepartment(department: string): number {
    for (let r = 0; r <= this.ROW_MAX; r++) {
      const cell: CellObject = this.sh[utils.encode_cell({ r, c: 0 })];
      if (cell?.v === department) {
        return r;
      }
    }
    throw new Error('Филиал не найден');
  }
}
