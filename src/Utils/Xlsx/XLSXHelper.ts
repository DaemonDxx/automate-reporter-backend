import {
  UtilsXLSX,
  XLSX$FindParam,
  XLSX$FindResult,
  XLSX$Iterator,
} from '../../Typings/Modules/Parser/xlsx.utills';
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
  protected constructor(private ws: WorkSheet) {}

  //TODO доработать проверку по параметрам
  *findCellWithValue(
    value: string,
    params: XLSX$FindParam = defaultFindParam,
  ): IterableIterator<XLSX$FindResult> {
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
      if (cell.f && params.skipFunctionResult) continue;

      if (cell.v && cell.v === value)
        yield {
          address,
          cell,
        };
    }
  }

  getValue(address: CellAddress): string {
    return this.ws[utils.encode_cell(address)].v;
  }
}
