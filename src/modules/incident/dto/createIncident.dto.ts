import {
  Importance,
  SomeIncident,
  TypesIncidents,
} from '../../../typings/modules/incident';
import { SomeValue } from '../../../typings/modules/values';
import { Departments } from '../../../typings/departments';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { toArray } from '../../../utils/toArray.function';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentDto implements SomeIncident {
  @ApiProperty()
  @IsDefined()
  @IsMongoId()
  Reception: SomeValue;

  @ApiProperty()
  @IsDefined()
  @IsMongoId()
  Recoil: SomeValue;

  @ApiProperty({
    enum: toArray(Departments),
  })
  @IsDefined()
  @IsEnum(toArray(Departments))
  department: Departments;

  @ApiProperty()
  @IsDefined()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  isOnce: boolean;

  @ApiProperty({
    enum: toArray(TypesIncidents),
  })
  @IsDefined()
  @IsEnum(toArray(TypesIncidents))
  type: TypesIncidents;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(2010)
  @Max(2030)
  @Transform(({ value }) => {
    return parseInt(value);
  })
  year: number;

  @ApiProperty({
    enum: toArray(Importance),
  })
  @IsDefined()
  @IsEnum(toArray(Importance))
  importance: Importance;
}
