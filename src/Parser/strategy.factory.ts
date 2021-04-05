import { IParserStrategy } from './ParserStrategy/parserStrategy.interface';
import { WeeklyStrategy } from './ParserStrategy/Weekly/weekly.strategy';
import { TypesFile } from '../Typings/Modules/Storage';

export class StrategyFactory {
  private strategies = new Map();

  getStrategy(type: string): IParserStrategy {
    if (this.strategies.has(type)) {
      return this.strategies.get(type);
    }
    let strategy: IParserStrategy;

    switch (type) {
      case TypesFile.Weekly:
        strategy = new WeeklyStrategy();
        break;
      case TypesFile.TemperatureCoefficientsTable:
        strategy = new WeeklyStrategy();
        break;
    }

    this.strategies.set(type, strategy);
    return strategy;
  }
}
