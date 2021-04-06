import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';
import { IResultParsing } from './resultParsing.interface';
import { StrategyFactory } from './strategy.factory';
import { EventEmitter2 } from 'eventemitter2';
import { OnEvent } from '@nestjs/event-emitter';
import { FileUploadEvent } from '../Storage/Events/fileUpload.event';
import { ParseFailedEvent } from './Events/parseFailed.event';

@Injectable()
export class ParserService {
  strategyFactory: StrategyFactory;

  constructor(
    private readonly events: EventEmitter2,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.strategyFactory = new StrategyFactory();
  }

  @OnEvent(FileUploadEvent.Name)
  parse(payload: FileUploadEvent): IResultParsing {
    this.logger.log('FileUploadEvent');
    const timeStart: Date = new Date();
    try {
      const wb: WorkBook = this.readBook(payload.buffer);
      const indexActiveSheet: number = this.getActiveSheetIndex(wb);
      const activeSheet: WorkSheet = wb.Sheets[wb.SheetNames[indexActiveSheet]];
      return this.strategyFactory.getStrategy(payload.type).parse(activeSheet);
    } catch (e) {
      this.logger.error(e);
      this.events.emit(
        ParseFailedEvent.Name,
        new ParseFailedEvent({
          filename: payload.filename,
          parseErrors: e.errors,
        }),
      );
    }
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
