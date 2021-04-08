import { BaseValue, TypesValue } from '../../Typings/Modules/Values';
import { Departments } from '../../Typings/departments';
import * as mongoose from 'mongoose';
import { IsDefined, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Max, Min, MIN } from 'class-validator';
import { toArray } from '../../Utils/toArray.function';
import { Transform } from 'class-transformer';

export class CreateValueDto
  implements Omit<BaseValue, 'fromFile' | 'fromUser'> {
  @IsDefined()
  @IsEnum(toArray(Departments), {
    message: 'Выбранного филиала не сущестует',
  })
  department: Departments;

  @IsDefined()
  @IsString()
  description: string;

  @IsDefined()
  @IsEnum(toArray(TypesValue), {
    message: 'Данный тип значений не поддерживается',
  })
  type: TypesValue;

  @IsDefined()
  @IsNumber()
  @Transform(({ value }) => {
    return parseFloat(value);
  })
  v: number;

  @IsOptional()
  @IsNumber()
  @Min(2010)
  @Max(2030)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  year?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(11)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  month?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  day?: number;
}
