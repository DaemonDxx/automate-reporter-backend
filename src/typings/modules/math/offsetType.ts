import { Departments } from '../../departments';
import { SomeValue } from '../values';
import { Data$OffsetSolver } from './offset.personal';

export type OffsetType = {
  department: Departments;
  month: number | string;
  receptionBefore: number;
  receptionNow: number;
  temperatureBefore: number;
  temperatureNow: number;
  offset: number;
};

export type ComparedData = {
  before?: Data$OffsetSolver;
  now?: Data$OffsetSolver;
};

export type PreparedData = Map<number, ComparedData>;

