import { BaseValue, TypesValue } from '../../../typings/modules/values';
import { Departments } from '../../../typings/departments';
import * as mongoose from 'mongoose';
import {
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MIN,
} from 'class-validator';
import { toArray } from '../../../utils/toArray.function';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateValueDto
  implements Omit<BaseValue, 'fromFile' | 'fromUser'> {
  @ApiProperty()
  @IsDefined()
  @IsEnum(toArray(Departments), {
    message: 'Выбранного филиала не сущестует',
  })
  department: Departments;

  @ApiProperty()
  @IsDefined()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDefined()
  @IsEnum(toArray(TypesValue), {
    message: 'Данный тип значений не поддерживается',
  })
  type: TypesValue;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Transform(({ value }) => {
    return parseFloat(value);
  })
  v: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(2010)
  @Max(2030)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  year?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(11)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  month?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  day?: number;
}
