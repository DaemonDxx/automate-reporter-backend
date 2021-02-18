import * as hash from 'object-hash';
import { IDescriptor } from './descriptor.interface';
import { TYPES_REPORT } from '../typesReport.constant';
import { Description } from '../../dbModels/WeeklyModels/description.schema';
import { IDescription } from '../../dbModels/Interfaces/description.interface';

export class DescriptorWeekly implements IDescriptor {
  forType = TYPES_REPORT.WEEKLY;
  department: string;
  branch: string;
  consumer: string;
  year: string;
  key: string;

  setYearBefore() {
    this.year = 'before';
  }

  setYearNow() {
    this.year = 'now';
  }

  getDescription(): IDescription {
    return {
      forType: this.forType,
      meta: this.createMetadata(),
      key: this.createKey(),
    };
  }

  createMetadata(): string {
    return `${this.department} - ${this.branch} - ${this.consumer} - ${
      this.year === 'before' ? 'Прошлый период' : 'Текущий период'
    }`;
  }

  createKey(): string {
    return hash(this.getDataForKey());
  }

  private getDataForKey(): any {
    return {
      department: this.department,
      branch: this.branch,
      consumer: this.consumer,
      year: this.year,
    };
  }

  setDBModel(model: Description) {
    const arr: string[] = model.meta.replace(' ', '').split('-');
    this.department = arr[0];
    this.branch = arr[1];
    this.consumer = arr[2];
    this.year = arr[3];
    this.key = model.key;
  }
}
