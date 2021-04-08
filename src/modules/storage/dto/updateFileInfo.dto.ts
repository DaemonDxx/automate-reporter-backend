import { TypesFile } from '../../../typings/modules/storage';
import { File } from '../schemas/file.schema';
import { IsEnum, IsMongoId } from 'class-validator';
import { toArray } from '../../../utils/toArray.function';
import { ParseResultStatus } from '../../../typings/modules/parser';

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
