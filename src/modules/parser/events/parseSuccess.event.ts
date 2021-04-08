import { EventParser$Success } from '../../../typings/modules/events/parser';
import { ParseResultStatus } from '../../../typings/modules/parser';
import { SomeValue } from '../../../typings/modules/values';
import * as mongoose from 'mongoose';

export class ParseSuccessEvent implements EventParser$Success {
  static Name = 'parse.success';

  constructor(eventInfo: EventParser$Success) {
    Object.assign(this, eventInfo);
  }
  filename: string;
  result: ParseResultStatus.Success;
  values: SomeValue[];
  _id: mongoose.Schema.Types.ObjectId;
}
