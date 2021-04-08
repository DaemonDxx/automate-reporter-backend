import { Timestamp } from '../../index';
import { Parseble } from '../parser';

export enum TypesFile {
  Weekly = 'Weekly',
  TemperatureCoefficientsTable = 'TemperatureCoefficients',
  TemperatureTable = 'TemperatureTable',
  NoType = 'NoType',
}

export type BaseUploadFile = Timestamp & {
  filename: string;
  user: any;
  type: TypesFile;
};

export type ParsebleFile = BaseUploadFile & Parseble;

export type CreateFilenameFunction = (type: TypesFile) => string;
