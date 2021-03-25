import { BaseUploadFile, TypesFile } from '../../Typings/Modules/Storage';
import { File } from '../Schemas/file.schema';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { toArray } from '../../Utils/toArray.function';

export class UpdateFileInfoDto implements Pick<File, '_id' | 'type'> {
  @IsMongoId()
  _id: string;

  @IsEnum(toArray(TypesFile))
  type: TypesFile;
}
