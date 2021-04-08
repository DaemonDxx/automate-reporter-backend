import { EventParser$Failed } from '../../../typings/modules/events/parser';
import { ParseResultStatus } from '../../../typings/modules/parser';
import * as mongoose from 'mongoose';

export class ParseFailedEvent implements EventParser$Failed {
  static Name = 'parse.failed';

  constructor(eventInfo: Omit<EventParser$Failed, 'result'>) {
    Object.assign(this, eventInfo);
    this.result = ParseResultStatus.Failed;
  }

  filename: string;
  parseErrors: string[];
  result: ParseResultStatus.Failed;
  _id: mongoose.Schema.Types.ObjectId;
}
