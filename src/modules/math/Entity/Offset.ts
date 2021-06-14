import { OffsetType } from '../../../typings/modules/math/offsetType';
import { Departments } from '../../../typings/departments';
import { Transform } from "class-transformer";

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export class Offset implements OffsetType {
  department: Departments;

  @Transform(({ value }) => MONTHS[value])
  month: number | string;
  offset: number;
  receptionBefore: number;
  receptionNow: number;
  temperatureBefore: number;
  temperatureNow: number;
}
