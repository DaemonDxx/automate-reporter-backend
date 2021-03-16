import { Departments } from '../departments';

export enum TypesValue {
  Reception = 'Reception',
  Recoil = 'Recoil',
  Constant = 'Constant',
}

export type ImportedFromFile = {
  filename: string;
};

export type BaseValue = {
  department: Departments;
  type: TypesValue;
  description: string;
  v: number;
  year?: number;
  month?: number;
};

export type Range = {
  to: number;
  from: number;
};

export type TemperatureCoefficient = BaseValue & Range;

export type WeeklyValues = BaseValue & ImportedFromFile;

export type Value = BaseValue | TemperatureCoefficient | WeeklyValues;
