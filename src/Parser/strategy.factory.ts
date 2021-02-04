import { IParserStrategy } from './ParserStrategy/parserStrategy.interface';
import { TYPES_REPORT } from '../Utils/typesReport.constant';
import { WeeklyStrategy } from './ParserStrategy/Weekly/weekly.strategy';

export class StrategyFactory {
  private strategies = new Map();

  getStrategy(type: string): IParserStrategy {
    if (this.strategies.has(type)) {
      return this.strategies.get(type);
    }
    let strategy: IParserStrategy;

    switch (type) {
      case TYPES_REPORT.WEEKLY:
        strategy = new WeeklyStrategy();
        break;
    }

    this.strategies.set(type, strategy);
    return strategy;
  }
}
