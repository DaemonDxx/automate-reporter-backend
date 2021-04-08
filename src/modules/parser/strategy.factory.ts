import { IParserStrategy } from './parserStrategy/parserStrategy.interface';
import { TypesFile } from '../../typings/modules/storage';
import { CoefficientStrategy } from './parserStrategy/TemperatureFactor/Coefficient.strategy';
import { TemperatureFactorStrategy } from './parserStrategy/TemperatureFactor/TemperatureFactor.strategy';

export class StrategyFactory {
  private strategies = new Map();

  getStrategy(type: string): IParserStrategy {
    if (this.strategies.has(type)) {
      return this.strategies.get(type);
    }
    let strategy: IParserStrategy;

    switch (type) {
      case TypesFile.Weekly:
        //strategy = new WeeklyStrategy();
        break;
      case TypesFile.TemperatureCoefficientsTable:
        strategy = new CoefficientStrategy();
        break;
      case TypesFile.TemperatureTable:
        strategy = new TemperatureFactorStrategy();
    }

    this.strategies.set(type, strategy);
    return strategy;
  }
}
