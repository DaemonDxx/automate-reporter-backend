import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Timestamp } from '../../Typings';
import { Parseble } from '../../Typings/Modules/Parser';

export abstract class MongooseCRUDService<
  T,
  D extends T & Document = T & Document
> {
  protected constructor(private readonly model: Model<D>) {}

  async create(createDTO: Omit<T, keyof Timestamp>): Promise<D> {
    const created = new this.model(createDTO);
    return created.save();
  }

  async find(query: FilterQuery<D>): Promise<D[]> {
    const findItems = await this.model.find(query);
    return findItems;
  }

  async update(update: UpdateQuery<D>): Promise<D> {
    const updatedItem = await this.model.findByIdAndUpdate(update._id, update, {
      new: true,
    });
    return updatedItem;
  }
}
