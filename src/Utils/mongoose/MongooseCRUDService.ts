import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Timestamp } from '../../Typings';
import { File } from '../../Storage/Schemas/file.schema';

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

  async findByID(_id: string): Promise<D> {
    const findItem = await this.model.findById(_id);
    return findItem;
  }

  async update(update: UpdateQuery<D>): Promise<D> {
    const updatedItem = await this.model.findByIdAndUpdate(update._id, update, {
      new: true,
    });
    return updatedItem;
  }
}
