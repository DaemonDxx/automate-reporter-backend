import { Timestamp } from '../../index';
import { Parseble } from '../Parser';

export enum TypesFile {
  Weekly = 'WEEKLY',
  TemperatureCoefficientsTable = 'TemperatureCoefficients',
  TemperatureTable = 'TemperatureTable',
}

export type BaseUploadFile = Timestamp & {
  filename: string;
  user: any;
  type: TypesFile;
};

export type UploadFile = BaseUploadFile & Parseble;
