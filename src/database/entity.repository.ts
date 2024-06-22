import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    return this.entityModel.find(filter);
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findOne(filter, projection, options);
  }

  async findById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findById(id, projection, options);
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(filter, updateEntityData, {
      new: true,
    });
  }

  async delete(filter: FilterQuery<T>): Promise<boolean> {
    const deletedResult = await this.entityModel.deleteOne(filter);
    return deletedResult.deletedCount >= 1 ? true : false;
  }
}
