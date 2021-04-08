import { WorkSheet } from 'xlsx';

import { SomeValue } from '../../../typings/modules/values';

interface IParserStrategy {
  parse(sh: WorkSheet): SomeValue[];
}

export { IParserStrategy };
