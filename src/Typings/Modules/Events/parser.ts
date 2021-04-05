import { ParseResultStatus } from '../Parser';
import { Value } from '../../Values';
import { ParsebleFile } from '../Storage';

type EventParser$Base = Required<
  Pick<ParsebleFile, 'filename' | 'timeStart' | 'timeEnd'>
>;

type SuccessResult = {
  result: ParseResultStatus.Success;
  values: Value[];
};

type FailedResult = {
  result: ParseResultStatus.Failed;
  parseErrors: string[];
};

export type EventParser$Success = EventParser$Base & SuccessResult;

export type EventParser$Failed = EventParser$Base & FailedResult;
