import { IParserStrategy } from './parserStrategy.interface';
import { WorkSheet, CellAddress, CellObject, utils } from 'xlsx';
import IValue from './value.interface';
import createKey from '../Utils/hash.function';
import { findCellByValue } from '../Utils/xlsx.utils.functions';

const MAIN_CONSUMER = ['ООО "Боголюбовское"'];

const CONSUMER_FOR_DEPARTMENT_ASSOCIATION = [
  {
    department: 'Красноярскэнерго',
    consumer: 'ООО "Боголюбовское"',
  },
];

const BRANCHES = [
  'Промышленные потребители',
  'Нефте- и газопроводы',
  'Транспорт',
  'Сельское хозяйство и пищевая промышленность',
  'Непромышленные потребители ',
  'Государственные (муниципальные) организации и прочие бюджетные потребители',
  'Население и приравненные группы потребителей',
  'Территориальные сетевые организации',
];

function match(consumer: string): string {
  let department: string;
  CONSUMER_FOR_DEPARTMENT_ASSOCIATION.forEach((item) => {
    if (item.consumer === consumer) {
      department = item.department;
    }
  });
  return department;
}

const QUERY_PARAMS = {
  RECOIL: 'отпуск из сети,\r\nмлн кВтч',
  RECEPTION: 'отпуск в сеть,\r\nмлн кВтч',
  CONSUMER: 'Наименование отрасли / потребителя',
};

class WeeklyStrategy implements IParserStrategy {
  //Столбец Отпуск из сеть прошлый год
  column_recoil_before_year: number;

  //Столбец Отпуск из сеть этот год
  column_recoil_now_year: number;

  //Столбец Отпуск в сеть
  column_reception_before_year: number;

  //Столбец Отпуск в сеть
  column_reception_now_year: number;

  //Столбец Наименование отрасли/потребителя
  column_consumer: number;

  maxRow: number = 1000;
  maxCol: number = 30;

  department: string;

  startRowIndex: number;

  sh: WorkSheet;

  parse(sh: WorkSheet): string {
    let result: Array<IValue> = [];
    this.sh = sh;
    this.findUndUpdateColumn();
    this.department = this.findAndDefineDepartment();
    BRANCHES.forEach((item) => {
      result = result.concat(this.parseByBranch(item));
    });
    return '';
  }

  parseByBranch(branch: string): Array<IValue> {
    const result: Array<IValue> = [];
    const startAddress: CellAddress = findCellByValue(this.sh, branch, {
      minRow: this.startRowIndex,
      column: this.column_consumer,
    });

    if (branch === 'Население и приравненные группы потребителей') {
      result.push({
        key: createKey([this.department, branch, 'before']),
        value: this.getValueByConsumer(startAddress.r, 'before'),
      });
      result.push({
        key: createKey([this.department, branch, 'now']),
        value: this.getValueByConsumer(startAddress.r, 'now'),
      });
      return result;
    }

    let offset: number = startAddress.r + 1;
    const column: number = startAddress.c;

    while (true) {
      const nextCell: CellObject = this.sh[
        utils.encode_cell({ r: offset, c: column })
      ];
      if (this.isEndBranch(nextCell)) {
        break;
      }
      result.push({
        key: createKey([this.department, branch, <string>nextCell.v, 'before']),
        value: this.getValueByConsumer(offset, 'before'),
      });
      result.push({
        key: createKey([this.department, branch, <string>nextCell.v, 'now']),
        value: this.getValueByConsumer(offset, 'now'),
      });
      offset++;
    }
    return result;
  }

  private isEndBranch(cell: CellObject): boolean {
    let isEnd = false;
    if (!cell) {
      return true;
    }
    if (!cell.v) {
      return true;
    }

    BRANCHES.forEach((item) => {
      if (item === cell.v) {
        isEnd = true;
      }
    });
    return isEnd;
  }

  private getValueByConsumer(r: number, year: string, type = 'recoil'): number {
    let column;

    if (year === 'before') {
      column =
        type === 'recoil'
          ? this.column_recoil_before_year
          : this.column_reception_before_year;
    } else {
      column =
        type === 'recoil'
          ? this.column_recoil_now_year
          : this.column_reception_now_year;
    }
    const cell: CellObject = this.getCell({ r, c: column });
    return this.getValue(cell);
  }

  private getCell(address: CellAddress): CellObject {
    return this.sh[utils.encode_cell(address)];
  }

  private getValue(cell: CellObject): number {
    if (!cell) {
      return 0;
    }
    if (!cell.v) {
      return 0;
    }
    return <number>cell.v;
  }

  private findUndUpdateColumn(): void {
    this.updateColumnReception();
    this.updateColumnRecoil();
    this.updateColumnConsumer();
    this.updateStartRowIndex();
  }

  private updateColumnRecoil(): void {
    const adrr: CellAddress = findCellByValue(this.sh, QUERY_PARAMS.RECOIL);
    this.column_recoil_before_year = adrr.c;
    this.column_recoil_now_year = adrr.c + 1;
    console.log(`Отпуск из сети: ${utils.encode_cell(adrr)}`);
  }

  private updateColumnReception(): void {
    const adrr: CellAddress = findCellByValue(this.sh, QUERY_PARAMS.RECEPTION);
    this.column_reception_before_year = adrr.c;
    this.column_reception_now_year = adrr.c + 1;
    console.log(`Отпуск в сеть: ${utils.encode_cell(adrr)}`);
  }

  private updateColumnConsumer(): void {
    const adrr: CellAddress = findCellByValue(this.sh, QUERY_PARAMS.CONSUMER);
    this.column_consumer = adrr.c;
    console.log(`Потребители: ${utils.encode_cell(adrr)}`);
  }

  private updateStartRowIndex(): void {
    let i = 1;

    while (true) {
      const address: CellAddress = findCellByValue(this.sh, 'Всего', {
        minRow: i,
        column: this.column_consumer,
      });

      const cell: CellObject = this.getCell({
        r: address.r,
        c: this.column_reception_before_year,
      });

      if (!cell.f) {
        this.startRowIndex = address.r;
        break;
      } else {
        i = address.r + 1;
      }
    }
  }

  private findAndDefineDepartment(): string {
    for (let i = this.startRowIndex; i < this.startRowIndex + 100; i++) {
      const nextCell: CellObject = this.getCell({
        r: i,
        c: this.column_consumer,
      });
      if (!nextCell.v) continue;

      if (MAIN_CONSUMER.includes(<string>nextCell.v)) {
        return match(<string>nextCell.v);
      }
    }
  }
}

export { WeeklyStrategy };
