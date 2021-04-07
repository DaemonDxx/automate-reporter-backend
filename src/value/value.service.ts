import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Value, ValueModel } from './schemas/value.schema';
import { FilterQuery, Model } from 'mongoose';
import {
  CoefficientValue,
  CoefficientValueModel,
} from './schemas/coefficient.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { ParseSuccessEvent } from '../Parser/Events/parseSuccess.event';
import { SomeValue, TypesValue } from '../Typings/Values';

export type SomeValueModel = CoefficientValueModel | ValueModel;

@Injectable()
export class ValueService {
  constructor(
    @InjectModel(Value.name)
    private readonly Value: Model<ValueModel | CoefficientValueModel>,
  ) {}

  @OnEvent(ParseSuccessEvent.Name, { async: true })
  async saveParsedValues(payload: ParseSuccessEvent) {
    const promises: Promise<SomeValueModel>[] = payload.values.map((el) => {
      const query = Object.assign({}, el);
      delete query.v;
      return this.Value.findOneAndUpdate(query, el, {
        upsert: true,
        new: true,
      }).exec();
    });
    const result: SomeValueModel[] = await Promise.all(promises);
    console.table(result.map((el) => el.toObject()));
  }

  private transformToModel(values: SomeValue[]): SomeValueModel[] {
    const result: SomeValueModel[] = [];
    for (const item of values) {
      result.push(new this.Value(item));
    }
    return result;
  }
}
