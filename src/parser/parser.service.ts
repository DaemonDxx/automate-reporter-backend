import { Injectable } from '@nestjs/common';
import { ParsingData } from './parsingData.interface';
import { IParserStrategy } from './ParserStrategy/parserStrategy.interface';
import { WeeklyStrategy } from './ParserStrategy/weekly.strategy';
import { WorkSheet, WorkBook, read } from 'xlsx';
import * as XLSX from 'xlsx';
import { IResultParsing } from './resultParsing.interface';

@Injectable()
export class ParserService {
  ParserStrategy: IParserStrategy;

  constructor() {
    this.ParserStrategy = new WeeklyStrategy();
  }

  parse(data: ParsingData): IResultParsing {
    const wb: WorkBook = this.readBook(data.file);
    const indexActiveSheet: number = this.getActiveSheetIndex(wb);
    const activeSheet: WorkSheet = wb.Sheets[wb.SheetNames[indexActiveSheet]];
    return this.ParserStrategy.parse(activeSheet);
  }

  private readBook(buffer: Buffer): WorkBook {
    const wb: WorkBook = XLSX.read(buffer, { type: 'buffer' });
    return wb;
  }

  private getActiveSheetIndex(wb: WorkBook): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const index = wb.Workbook.WBView[0].activeTab;
    return index;
  }
}
