import { Injectable } from '@nestjs/common';
import { IResultParsing } from './parser/resultParsing.interface';
import { Report } from './dbModels/WeeklyModels/report.schema';
import { Description } from './dbModels/WeeklyModels/description.schema';
import { IDescription } from './parser/ParserStrategy/description.interface';
import IValue from './parser/ParserStrategy/value.interface';
import { ErrorOfReport } from './dbModels/WeeklyModels/error.schema';
import { ParserService } from './parser/parser.service';
import { FilesService } from './files/files.service';

@Injectable()
export class AppService {

  constructor(
    private readonly parserService: ParserService,
    private readonly fileService: FilesService
  ) {
  }

  getHello(): string {
    return 'Hello World!';
  }

  async parseFile(filename: string): Promise<IResultParsing> {
    const buffer: Buffer = await this.fileService.getBufferOfFile(filename);
    const result: IResultParsing = this.parserService.parse({
      file: buffer,
      type: 'weekly',
    });
    this.createReport(result);
  }

  createReport(resultParsing: IResultParsing): Report {

  }

  saveValues(values: Array<IValue>, report: Report) {

  }

  findOrCreateDescription(description: IDescription): Description {

  }

  checkError(report: Report): Array<ErrorOfReport> {

  }



}
