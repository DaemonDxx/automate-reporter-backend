import { IFileReport } from '../../fileTemplate.interface';
import { Value } from '../../../dbModels/WeeklyModels/value.schema';

export class MainFullFile implements IFileReport {
  templateFilename = 'main_full.xlsx';

  private payload: Buffer;

  generateFileByTemplate(values: Value[]): Promise<boolean> {
    return Promise.resolve(false);
  }

  getFile(): Buffer {
    return this.payload;
  }

  getFilename(): string {
    return `Еженедельный отчет в Россети полный формат`;
  }
}
