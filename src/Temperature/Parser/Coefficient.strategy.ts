import { CellObject, WorkSheet, utils } from 'xlsx';
import { DEPARTMENTS } from '../departments.constant';
import { ICoefficient } from '../Models/coefficient.interface';
import { ParseFailedError } from '../../Utils/Errors/ParseFailed.error';

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
    this.COLUMN_START_TAG = this.findStartTagColumn();
    for (const department of DEPARTMENTS) {
      const rowDepartment: number = this.findRowDepartment(department);
      const c = this.COLUMN_START_TAG;
      for (let c = this.COLUMN_START_TAG; c <= this.COLUMN_START_TAG + 6; c++) {
        const cell: CellObject = this.sh[
          utils.encode_cell({ r: rowDepartment, c })
        ];

        if (!isNaN(parseFloat(<string>cell?.v))) {
          const tag = this.sh[utils.encode_cell({ r: 0, c })].v;
          const value = parseFloat(
            this.sh[
              utils.encode_cell({
                r: rowDepartment + this.OFFSET_ROW_COEFFICIENT,
                c,
              })
            ].v,
          );
          const minTemp = this.sh[
            utils.encode_cell({
              r: rowDepartment + this.OFFSET_ROW_MIN_TEMP,
              c,
            })
          ].v;
          const maxTemp = this.sh[
            utils.encode_cell({
              r: rowDepartment + this.OFFSET_ROW_MAX_TEMP,
              c,
            })
          ].v;
          result.push({
            department: department,
            tag,
            value,
            minTemp,
            maxTemp,
          });
        } else {
          break;
        }
      }
    }
    return result;
  }

  private findStartTagColumn(): number {
    for (const cellName of Object.keys(this.sh)) {
      if (cellName === '!ref') continue;
      const cell: CellObject = this.sh[cellName];
      if (cell?.v === 'I') return utils.decode_cell(cellName).c;
    }
    throw new Error('Не найден столбец с содержимым "I"');
  }

  private findRowDepartment(department: string): number {
    for (let r = 0; r <= this.ROW_MAX; r++) {
      const cell: CellObject = this.sh[utils.encode_cell({ r, c: 0 })];
      let v: string = <string>cell?.v;
      if (v) v = v.trim();
      if (v === department) {
        return r;
      }
    }
    throw new Error('Филиал не найден');
  }
}
