import { Injectable } from '@nestjs/common';
import { ParsingData } from './parsingData.interface';
import { IParserStrategy } from './ParserStrategy/parserStrategy.interface';
import { WeeklyStrategy } from './ParserStrategy/weekly.strategy';
import { WorkSheet, WorkBook, read } from 'xlsx';
import * as XLSX from 'xlsx';

@Injectable()
export class ParserService {
  ParserStrategy: IParserStrategy;

  constructor() {
    this.ParserStrategy = new WeeklyStrategy();
  }

  parse(data: ParsingData): string {
    const wb: WorkBook = this.readBook(data.file);
    const indexActiveSheet: number = this.getActiveSheetIndex(wb);
    const activeSheet: WorkSheet = wb.Sheets[wb.SheetNames[indexActiveSheet]];
    this.ParserStrategy.parse(activeSheet);
    return '';
  }

  readBook(buffer: Buffer): WorkBook {
    const wb: WorkBook = XLSX.read(buffer, { type: 'buffer' });
    return wb;
  }

  getActiveSheetIndex(wb: WorkBook): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const index = wb.Workbook.WBView[0].activeTab;
    return index;
  }
}
