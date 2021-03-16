import { CellAddress, CellObject } from 'xlsx';

export type XLSX$FindParam = {
  skipFunctionResult?: boolean;
};

export type XLSX$NextCell = () => CellObject;

export type XLSX$Iterator = {
  next: XLSX$NextCell;
};

export type UtilsXLSX = {
  findCellsWithValue: (value: string, params?: XLSX$FindParam) => XLSX$Iterator;
  getValue: <T>(cell: CellAddress) => T;
};
