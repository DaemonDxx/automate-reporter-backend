import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Value, ValueModel } from './schemas/value.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  CoefficientValue,
  CoefficientValueModel,
} from './schemas/coefficient.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { ParseSuccessEvent } from '../parser/events/parseSuccess.event';
import { SomeValue, TypesValue } from '../../typings/modules/values';
import { ValueQuery } from '../../typings/modules/values/DTO/valueQuery';
import { MongooseCRUDService } from '../../utils/mongoose/MongooseCRUDService';


export type SomeValueModel = CoefficientValueModel | ValueModel;

@Injectable()
export class ValueService extends MongooseCRUDService<SomeValueModel> {
  constructor(
    @InjectModel(Value.name)
    private readonly Value: Model<SomeValueModel>,
  ) {
    super(Value);
  }

  @OnEvent(ParseSuccessEvent.Name, { async: true })
  async saveParsedValues(payload: ParseSuccessEvent) {
    const promises: Promise<SomeValueModel>[] = payload.values.map((el) => {
      const query = Object.assign({}, el);
      Object.assign(el, { fromFile: payload._id });
      delete query.v;
      return this.Value.findOneAndUpdate(query, el, {
        upsert: true,
        new: true,
      }).exec();
    });
    const result: SomeValueModel[] = await Promise.all(promises);
  }
}
