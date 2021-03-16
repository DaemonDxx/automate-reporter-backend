import { Value } from '../../Values';
import { WorkSheet } from 'xlsx';

export type Parser = {
  parseWorksheet: (ws: WorkSheet) => Value[];
};

enum ParseResultStatus {
  Ready,
  InProgress,
  Success,
  Failed,
  NotParseble,
}

export type ParseInfo = {
  timeStart?: number;
  timeEnd?: number;
  countValues?: number;
}

export type ParsedStatus = {
  result: ParseResultStatus;
}

export type Parseble = ParsedStatus & ParseInfo;


