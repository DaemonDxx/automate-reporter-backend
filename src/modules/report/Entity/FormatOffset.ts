import { FormatOffsetType } from '../../../typings/modules/report';
import { Departments } from '../../../typings/departments';
import { IsInt, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class FormatOffset implements FormatOffsetType {
  department: Departments;

  @Transform(({ value }) => parseFloat(value))
  offset: number;
  @Transform(({ value }) => parseFloat(value))
  receptionBefore: number;
  @Transform(({ value }) => parseFloat(value))
  receptionNow: number;
  @Transform(({ value }) => parseFloat(value))
  temperatureBefore: number;
  @Transform(({ value }) => parseFloat(value))
  temperatureNow: number;
}