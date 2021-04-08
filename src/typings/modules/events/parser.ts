import { ParseResultStatus } from '../parser';
import { SomeValue } from '../values';
import { ParsebleFile } from '../storage';
import { MongooseID } from '../../index';

type EventParser$Base = Required<Pick<ParsebleFile, 'filename'> & MongooseID>;

type SuccessResult = {
  result: ParseResultStatus.Success;
  values: SomeValue[];
};

type FailedResult = {
  result: ParseResultStatus.Failed;
  parseErrors: string[];
};

export type EventParser$Success = EventParser$Base & SuccessResult;

export type EventParser$Failed = EventParser$Base & FailedResult;
