import { BaseValue } from '../../../typings/modules/values';
import { MongooseID } from '../../../typings';
import * as mongoose from 'mongoose';
import { IsDefined, IsMongoId, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateValueDto
  implements Pick<BaseValue & MongooseID, 'v' | '_id'> {
  @ApiProperty()
  @IsDefined()
  @IsMongoId()
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Transform(({ value }) => {
    return parseFloat(value);
  })
  v: number;
}

