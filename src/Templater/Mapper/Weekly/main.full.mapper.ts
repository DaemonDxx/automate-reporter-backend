import { IMapper } from '../mapper.interface';
import * as xlsx from 'xlsx';
import { DescriptorWeekly } from '../../../Utils/Descriptor/descriptor.weekly';
import { Cell, ValueType, Workbook, Worksheet } from 'exceljs';
import * as fs from 'fs';

const BRANCHES = [
  'Промышленные потребители',
  'Нефте- и газопроводы',
  'Транспорт',
  'Сельское хозяйство и пищевая промышленность',
  'Непромышленные потребители ',
  'Государственные (муниципальные) организации и прочие бюджетные потребители',
  'Территориальные сетевые организации',
];

export class MainFullMapper implements IMapper {
  //Наименование отросли (Стобец Е)
  private column_consumer = 'E';

  //ТСО (Столбец D)
  private column_department = 'D';

  //Столбец Отпуск из сеть прошлый год (Столбец N)
  private column_recoil_before_year = 'N';

  //Столбец Отпуск из сеть этот год (Стобец O)
  private column_recoil_now_year = 'O';

  //Столбец Отпуск в сеть (Столбец J)
  private column_reception_before_year = 'J';

  //Столбец Отпуск в сеть (Столбец K)
  private column_reception_now_year = 'K';

  private row_start = 19;

  private currentBrunch;

  private maxSteps = 600;

  private currentSheet: Worksheet;

  private descriptor: DescriptorWeekly;

  constructor() {
    this.descriptor = new DescriptorWeekly();
  }

  async mapTemplateByFile(file: Buffer): Promise<Buffer> {
    const wb: Workbook = new Workbook();
    await wb.xlsx.load(file);
    this.currentSheet = wb.getWorksheet('Текущий');

    for (let i = this.row_start; i < this.maxSteps; i++) {
      const cell_consumer: Cell = this.currentSheet.getCell(`${this.column_consumer}${i}`);
      if (!cell_consumer) {
        break;
      }
      const value: string = <string>cell_consumer.value;
      if (value === 'Всего') {
        this.mapAllField(i);
      } else if (BRANCHES.includes(value)) {
        this.setCurrentBranch(value);
      } else if (value) {
        this.mapConsumerField(i, value);
      }
    }
    const buff = await wb.xlsx.writeBuffer();
    fs.writeFileSync('tesd1.xlsx', <Buffer>buff);

    return undefined;
  }

  private setCurrentBranch(branch: string) {
    this.descriptor.branch = branch;
  }

  private mapAllField(row: number) {
    let key: string;
    this.descriptor.department = <string>this.currentSheet.getCell(`${this.column_department}${row}`).value;
    this.descriptor.branch = 'all';
    this.descriptor.consumer = 'all';
    this.descriptor.year = 'before';
    key = this.descriptor.createKey();
    this.mapValueInCell(key, row, this.column_reception_before_year);
    this.descriptor.year = 'now';
    key = this.descriptor.createKey();
    this.mapValueInCell(key, row, this.column_reception_now_year);
  }

  private mapConsumerField(row: number, consumer: string) {
    let key: string;
    this.descriptor.consumer = consumer;
    this.descriptor.year = 'before';
    key = this.descriptor.createKey();
    this.mapValueInCell(key, row, this.column_recoil_before_year);
    this.descriptor.year = 'now';
    key = this.descriptor.createKey();
    this.mapValueInCell(key, row, this.column_recoil_now_year);
  }

  private mapValueInCell(key: string, row: number, column: string) {
    const cell: Cell = this.currentSheet.getCell(`${column}${row}`);
    cell.value = key;
  }

}
