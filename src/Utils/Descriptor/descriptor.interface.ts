import { Description } from '../../dbModels/WeeklyModels/description.schema';

export interface IDescriptor {
  forType: string;
  getDBModel(): Description;
  setDBModel(model: Description);
}