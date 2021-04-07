import { WorkSheet } from 'xlsx';

import { SomeValue } from '../../Typings/Values';

interface IParserStrategy {
  parse(sh: WorkSheet): SomeValue[];
}

export { IParserStrategy };
