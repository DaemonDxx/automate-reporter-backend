import {
  UtilsXLSX,
  XLSX$FindParam,
  XLSX$FindResult,
  XLSX$Iterator,
} from '../../typings/utils/xlsx/xlsx.utills';
import { CellAddress, CellObject, utils, WorkSheet } from 'xlsx';

const defaultFindParam: Required<XLSX$FindParam> = {
  skipFunctionResult: false,
  range: {
    s: {
      r: 0,
      c: 0,
    },
    e: {
      r: 10000,
      c: 10000,
    },
  },
};

export abstract class XLSXHelper {
  ws: WorkSheet;

  //TODO доработать проверку по параметрам
  *findCellsWithValue(
    value: string | number,
    params: XLSX$FindParam = defaultFindParam,
  ): IterableIterator<XLSX$FindResult> {
    params = Object.assign({}, defaultFindParam, params);
    for (const key in this.ws) {
      if (key[0] === '!') continue;

      const address: CellAddress = utils.decode_cell(key);

      if (
        address.c > params.range.e.c ||
        address.c < params.range.s.c ||
        address.r > params.range.e.r ||
        address.r < params.range.s.r
      )
        continue;

      const cell: CellObject = this.ws[key];
      if (cell?.f && params.skipFunctionResult) continue;
      if (!cell) continue;
      const v = cell.v;
      if (typeof v === 'string') {
        v.trim();
      }
      if (v == value)
        yield {
          address,
          cell,
        };
    }
    return null;
  }

  getStringByCell(address: CellAddress): string {
    return this.ws[utils.encode_cell(address)]?.v;
  }

  getFloatByCell(address: CellAddress): number {
    return parseFloat(this.ws[utils.encode_cell(address)]?.v);
  }
}
