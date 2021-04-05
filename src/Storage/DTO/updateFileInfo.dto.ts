import { TypesFile } from '../../Typings/Modules/Storage';
import { File } from '../Schemas/file.schema';
import { IsEnum, IsMongoId } from 'class-validator';
import { toArray } from '../../Utils/toArray.function';
import { ParseResultStatus } from '../../Typings/Modules/Parser';

export class UpdateFileInfoDto
  implements Pick<File, '_id' | 'type' | 'result'> {
  @IsMongoId()
  _id: string;

  @IsEnum(toArray(TypesFile), {
    message: 'Данный тип файла не поддерживается',
  })
  type: TypesFile;

  readonly result: ParseResultStatus = ParseResultStatus.InProgress;
}
