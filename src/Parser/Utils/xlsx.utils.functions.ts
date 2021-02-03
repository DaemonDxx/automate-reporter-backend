import { CellAddress, CellObject, utils, WorkSheet } from 'xlsx';

interface IFindQueryOption {
  minRow?: number;
  maxRow?: number;
  column?: number;
}

interface IFindResult {
  cell: CellObject;
  address: CellAddress;
}

function findCellByValue(
  sh: WorkSheet,
  value: string | number,
  options: IFindQueryOption = {},
): CellAddress {
  let cell: CellObject;

  if (!options.minRow) {
    options.minRow = 0;
  }
  if (!options.maxRow) {
    options.maxRow = 50000;
  }

  for (const item in sh) {
    const address: CellAddress = utils.decode_cell(item);

    if (address.r < options.minRow || address.r >= options.maxRow) continue;
    if (options.column) if (options.column !== address.c) continue;
    if (item[0] === '!') continue;

    cell = <CellObject>sh[item];
    if (cell.v === value) {
      return address;
    }
  }

  throw new Error('Ячейка не найдена');
}

export { findCellByValue };
