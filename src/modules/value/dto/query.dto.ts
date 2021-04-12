import { BaseValue, TypesValue } from '../../../typings/modules/values';
import { Departments } from '../../../typings/departments';
import * as mongoose from 'mongoose';
import { ApiQuery } from '@nestjs/swagger';

export class QueryDto implements Partial<BaseValue> {
  day?: number;
  department?: Departments;
  description?: string;
  fromFile?: mongoose.Schema.Types.ObjectId | string;
  fromUser?: mongoose.Schema.Types.ObjectId | string;
  month?: number;
  type?: TypesValue;
  year?: number;
}
