import { Value } from '../dbModels/WeeklyModels/value.schema';

export interface IFileReport {
  templateFilename: string;
  generateFileByTemplate(values: Value[]): Promise<boolean>;
  getFilename(): string;
  getFile(): Buffer;
}
