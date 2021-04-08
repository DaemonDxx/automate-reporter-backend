import { BaseValue } from '../../Typings/Modules/Values';
import { MongooseID } from '../../Typings';
import * as mongoose from 'mongoose';
import { IsDefined, IsMongoId, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateValueDto
  implements Pick<BaseValue & MongooseID, 'v' | '_id'> {
  @IsDefined()
  @IsMongoId()
  _id: mongoose.Schema.Types.ObjectId;

  @IsDefined()
  @IsNumber()
  @Transform(({ value }) => {
    return parseFloat(value);
  })
  v: number;
}
