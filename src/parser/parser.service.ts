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
    const ws: WorkSheet = this.readBook(data.file);
    this.ParserStrategy.parse(ws);
    return '';
  }

  readBook(buffer: Buffer): WorkSheet {
    const wb: WorkBook = XLSX.read(buffer, { type: 'buffer' });
    return wb.Sheets[0];
  }
}
