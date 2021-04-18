import { Coefficient, Electricity, Temperature } from '../values';
import { Departments } from '../../departments';

export type Query$PersonalOffset = {
  reception: number;
  temperatureBefore: number;
  temperatureNow: number;
  department: Departments;
};

export type Query$OffsetsByYear = {
  yearBefore: number;
  yearNow: number;
};

export type Data$OffsetSolver = {
  reception: number;
  temperature: number;
  coefficient: Coefficient;
};