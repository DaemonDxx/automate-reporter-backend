import { Timestamp } from '../../index';
import { Parseble } from '../Parser';

export enum TypesFile {
  Weekly = 'WEEKLY',
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
