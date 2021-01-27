import { IParserStrategy } from './parserStrategy.interface';
import { WorkSheet } from 'xlsx';

class WeeklyStrategy implements IParserStrategy {
  parse(sh: WorkSheet): string {
    return '';
  }
}

export { WeeklyStrategy };
