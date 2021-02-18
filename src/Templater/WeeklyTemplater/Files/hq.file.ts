import { MainFullFile } from './main.full.file';
import { Value } from '../../../dbModels/WeeklyModels/value.schema';

export class HqFile extends MainFullFile {



  // constructor(baseFile?: Buffer) {
  //   super();
  //   if (baseFile) {
  //     this.payload = baseFile;
  //   }
  // }

  async generateFileByTemplate(values: Value[]): Promise<boolean> {
    const isCreated = super.generateFileByTemplate(values);
    if (isCreated) {
    }
    return Promise.resolve(false);
  }
}
