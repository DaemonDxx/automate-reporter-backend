import { ParsedFile } from '../../dbModels/WeeklyModels/file.schema';

export interface ICheckerStrategy {
  check(file: ParsedFile): Promise<Array<string>>;
}
