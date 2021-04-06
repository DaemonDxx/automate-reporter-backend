import { WorkSheet } from 'xlsx';

import { Value } from '../../Typings/Values';

interface IParserStrategy {
  parse(sh: WorkSheet): Value[];
}

export { IParserStrategy };
