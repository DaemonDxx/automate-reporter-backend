import { CellAddress, CellObject, Range, WorkSheet } from 'xlsx';

export type XLSX$FindParam = {
  skipFunctionResult?: boolean;
  range?: Range;
};

export type XLSX$NextResult = () => {
  done: boolean;
  value: CellObject | undefined;
};

export type XLSX$FindResult = {
  cell: CellObject;
  address: CellAddress;
};

export type XLSX$Iterator = {
  next: XLSX$NextResult;
};

export type UtilsXLSX = {
  ws: WorkSheet;
  findCellsWithValue: (
    value: string,
    params?: XLSX$FindParam,
  ) => XLSX$FindResult;
  getValue: <T>(cell: CellAddress) => T;
};
