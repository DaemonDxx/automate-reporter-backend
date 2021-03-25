import { Value } from '../../Values';
import { WorkSheet } from 'xlsx';

export type Parser = {
  parseWorksheet: (ws: WorkSheet) => Value[];
};

export enum ParseResultStatus {
  Ready = 'Ready',
  InProgress = 'InProgress',
  Success = 'Success',
  Failed = 'Failed',
}

export type ParseInfo = {
  parseError?: string[];
  timeStart?: Date;
  timeEnd?: Date;
  countValues?: number;
};

export type ParsedStatus = {
  result: ParseResultStatus;
};

export type Parseble = ParsedStatus & ParseInfo;
