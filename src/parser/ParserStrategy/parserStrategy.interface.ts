import { WorkSheet } from 'xlsx';
import { IResultParsing } from '../resultParsing.interface';

interface IParserStrategy {
  parse(sh: WorkSheet): IResultParsing;
}

export { IParserStrategy };
