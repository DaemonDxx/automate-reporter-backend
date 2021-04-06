import { EventParser$Failed } from '../../Typings/Modules/Events/parser';
import { ParseResultStatus } from '../../Typings/Modules/Parser';
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
