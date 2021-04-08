import { WorkSheet } from 'xlsx';

import { SomeValue } from '../../Typings/Modules/Values';

interface IParserStrategy {
  parse(sh: WorkSheet): SomeValue[];
}

export { IParserStrategy };
