import { Departments } from '../../departments';
import { type } from 'os';
import { File } from '../../../modules/storage/schemas/file.schema';
import { User } from '../../../modules/auth/schemas/user.schema';
import mongoose from 'mongoose';

export enum TypesValue {
  Reception = 'Reception',
  Recoil = 'Recoil',
  Constant = 'Constant',
  Temperature = 'Temperature',
}

export type BaseValue = {
  department: Departments;
  type: TypesValue;
  description: string;
  v: number;
  year?: number;
  month?: number;
  day?: number;
  fromFile?: mongoose.Schema.Types.ObjectId | string;
  fromUser?: mongoose.Schema.Types.ObjectId | string;
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
