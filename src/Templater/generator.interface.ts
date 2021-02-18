import { IFileReport } from './fileTemplate.interface';

export interface IGenerator {
  generateFilesOfReport(reportID: string): Promise<IFileReport[]>;
}
