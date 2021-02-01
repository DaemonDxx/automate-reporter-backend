import { ParsedFile } from '../../dbModels/WeeklyModels/file.schema';
import { ErrorOfFile } from '../../dbModels/WeeklyModels/error.schema';

export interface IChecker {
  forFileOfTypeReport: string;
  checkFileForErrors(file: ParsedFile): Promise<ErrorOfFile>;
}
