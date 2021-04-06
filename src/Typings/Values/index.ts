import { Departments } from '../departments';
import { type } from 'os';

export enum TypesValue {
  Reception = 'Reception',
  Recoil = 'Recoil',
  Constant = 'Constant',
  Temperature = 'Temperature',
}

export type ImportedFromFile = {
  filename: string;
};

export type BaseValue = {
  department: Departments;
  type: TypesValue;
  description: string;
  v: number;
};

export type Dated = {
  year?: number;
  month?: number;
  day?: number;
};

export type Range = {
  minTemp: number;
  maxTemp: number;
};

export interface Temperature extends BaseValue, Dated {
  type: TypesValue.Constant;
}

export interface ElectricityVolume extends BaseValue, Dated, ImportedFromFile {
  type: TypesValue.Reception | TypesValue.Recoil;
}

export interface TemperatureCoefficient extends BaseValue, Range {
  type: TypesValue.Constant;
}

export type Value = TemperatureCoefficient | ElectricityVolume | Temperature;
