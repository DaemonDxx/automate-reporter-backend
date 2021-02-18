import { IParserStrategy } from '../parserStrategy.interface';
import { WorkSheet, CellAddress, CellObject, utils } from 'xlsx';
import { findCellByValue } from '../../Utils/xlsx.utils.functions';
import { IResultParsing } from '../../resultParsing.interface';
import { DescriptorWeekly } from '../../../Utils/Descriptor/descriptor.weekly';
import { IValue } from '../../../dbModels/Interfaces/value.interface';

const MAIN_CONSUMER = [
  'ООО "Боголюбовское"',
  'ООО Шахта Грамотеинская',
  'АО "Газпромнефть-ОНПЗ"',
  'прочие потребители (с ДСППУ)ООО "РУДНИК ВЕСЕЛЫЙ"',
  'ОАО "Территориальная генерирующая компания № 14" (Тимлюйская ТЭЦ)',
  'АО "Научно-производственная корпорация " Уралвагонзавод"',
  'ООО "Металлэнергофинанс"',
  'ЗАО КАРАТ - ЦМ (ВН)',
  'ЗАО "Золоторудная компания "Омчак"',
];

const CONSUMER_FOR_DEPARTMENT_ASSOCIATION = [
  {
    department: 'Красноярскэнерго',
    consumer: 'ООО "Боголюбовское"',
  },
  {
    department: 'Кузбассэнерго-РЭС',
    consumer: 'ООО Шахта Грамотеинская',
  },
  {
    department: 'Омскэнерго',
    consumer: 'АО "Газпромнефть-ОНПЗ"',
  },
  {
    department: 'ГАЭС',
    consumer: 'прочие потребители (с ДСППУ)ООО "РУДНИК ВЕСЕЛЫЙ"',
  },
  {
    department: 'Бурятэнерго',
    consumer:
      'ОАО "Территориальная генерирующая компания № 14" (Тимлюйская ТЭЦ)',
  },
  {
    department: 'Алтайэнерго',
    consumer: 'АО "Научно-производственная корпорация " Уралвагонзавод"',
  },
  {
    department: 'АО "Тываэнерго"',
    consumer: 'ООО "Металлэнергофинанс"',
  },
  {
    department: 'Хакасэнерго',
    consumer: 'ЗАО КАРАТ - ЦМ (ВН)',
  },
  {
    department: 'Читаэнерго',
    consumer: 'ЗАО "Золоторудная компания "Омчак"',
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

  maxRow = 1000;
  maxCol = 30;

  descriptor: DescriptorWeekly;

  startRowIndex: number;

  sh: WorkSheet;

  parse(sh: WorkSheet): IResultParsing {
    let result: Array<IValue> = [];
    this.sh = sh;
    this.findUndUpdateColumn();
    this.descriptor = new DescriptorWeekly();
    this.descriptor.department = this.findAndDefineDepartment();
    BRANCHES.forEach((item) => {
      this.descriptor.branch = item;
      result = result.concat(this.parseByBranch(item));
    });
    this.descriptor.branch = 'all';
    this.descriptor.consumer = 'all';
    result = result.concat(this.parseAllField());
    return {
      department: this.descriptor.department,
      data: result,
    };
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

  private parseAllField(): Array<IValue> {
    this.descriptor.setYearBefore();
    const result: Array<IValue> = [];
    result.push({
      description: this.descriptor.getDescription(),
      v: this.getValueByConsumer(this.startRowIndex, 'before', 'reception'),
    });
    this.descriptor.setYearNow();
    result.push({
      description: this.descriptor.getDescription(),
      v: this.getValueByConsumer(this.startRowIndex, 'now', 'reception'),
    });
    return result;
  }

  private parseByBranch(branch: string): Array<IValue> {
    const result: Array<IValue> = [];
    const startAddress: CellAddress = findCellByValue(this.sh, branch, {
      minRow: this.startRowIndex,
      column: this.column_consumer,
    });

    if (branch === 'Население и приравненные группы потребителей') {
      this.descriptor.consumer = branch;
      this.descriptor.setYearBefore();
      result.push({
        description: this.descriptor.getDescription(),
        v: this.getValueByConsumer(startAddress.r, 'before'),
      });
      this.descriptor.setYearNow();
      result.push({
        description: this.descriptor.getDescription(),
        v: this.getValueByConsumer(startAddress.r, 'now'),
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
      this.descriptor.consumer = <string>nextCell.v;
      this.descriptor.setYearBefore();
      result.push({
        description: this.descriptor.getDescription(),
        v: this.getValueByConsumer(offset, 'before'),
      });
      this.descriptor.setYearNow();
      result.push({
        description: this.descriptor.getDescription(),
        v: this.getValueByConsumer(offset, 'now'),
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
  }

  private updateColumnReception(): void {
    const adrr: CellAddress = findCellByValue(this.sh, QUERY_PARAMS.RECEPTION);
    this.column_reception_before_year = adrr.c;
    this.column_reception_now_year = adrr.c + 1;
  }

  private updateColumnConsumer(): void {
    const adrr: CellAddress = findCellByValue(this.sh, QUERY_PARAMS.CONSUMER);
    this.column_consumer = adrr.c;
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
}

export { WeeklyStrategy };
