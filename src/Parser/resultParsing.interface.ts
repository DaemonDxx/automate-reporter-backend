import { IValue } from '../dbModels/Interfaces/value.interface';

export interface IResultParsing {
  department: string;
  data: Array<IValue>;
}
