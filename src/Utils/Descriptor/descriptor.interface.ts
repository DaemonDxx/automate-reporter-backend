import { Description } from '../../dbModels/WeeklyModels/description.schema';
import { IDescription } from '../../dbModels/Interfaces/description.interface';

export interface IDescriptor {
  forType: string;
  getDescription(): IDescription;
  setDBModel(model: Description);
}
