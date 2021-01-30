import { IDescription } from './description.interface';

export class DescriptionsFactory {
  templateDescription: IDescription;

  constructor(department: string, branch: string) {
    this.templateDescription = {
      department,
      branch,
      key: '',
      consumer: '',
      year: '',
    };
  }

  public getDescriptionForBeforeYear(consumer: string): IDescription {
    const template: IDescription = this.getTemplateDescription(consumer);
    template.year = 'before';
    return template;
  }

  public getDescriptionForNowYear(consumer: string): IDescription {
    const template: IDescription = this.getTemplateDescription(consumer);
    template.year = 'now';
    return template;
  }

  private getTemplateDescription(consumer: string): IDescription {
    return { ...this.templateDescription, consumer };
  }
}
