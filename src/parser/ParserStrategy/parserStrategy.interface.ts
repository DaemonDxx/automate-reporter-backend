import { WorkSheet } from 'xlsx';

interface IParserStrategy {
  parse(sh: WorkSheet): string;
}

export { IParserStrategy };
