import { EventParser$Success } from '../../Typings/Modules/Events/parser';
import { ParseResultStatus } from '../../Typings/Modules/Parser';
import { Value } from '../../Typings/Values';

export class ParseSuccessEvent implements EventParser$Success {
  static Name = 'parse.success';

  constructor(eventInfo: EventParser$Success) {
    Object.assign(this, eventInfo);
  }
  filename: string;
  result: ParseResultStatus.Success;
  timeEnd: Date;
  timeStart: Date;
  values: Value[];
}