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
  year?: number;
  month?: number;
  day?: number;
};

export type Range = {
  minTemp: number;
  maxTemp: number;
};

export interface Temperature extends BaseValue {
  type: TypesValue.Temperature;
}

export interface Electricity extends BaseValue {
  type: TypesValue.Reception | TypesValue.Recoil;
}

export interface Coefficient extends BaseValue, Range {
  type: TypesValue.Constant;
}

export type SomeValue = Coefficient | Electricity | Temperature;
