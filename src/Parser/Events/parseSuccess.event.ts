import { EventParser$Success } from '../../Typings/Modules/Events/parser';
import { ParseResultStatus } from '../../Typings/Modules/Parser';
import { SomeValue } from '../../Typings/Values';
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
