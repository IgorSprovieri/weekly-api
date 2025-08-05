import { FilterQuery, Model } from "mongoose";

interface SeederDto<T> {
  model: Model<T>;
  values: Array<FilterQuery<T>>;
}

export class Seeder<T> {
  private model: Model<T>;
  private values: Array<FilterQuery<T>>;

  constructor({ model, values }: SeederDto<T>) {
    this.model = model;
    this.values = values;
  }

  async createSeedsOnDB() {
    const promiseAllList = this.values.map((value) => {
      return async () => {
        const found = await this.model.findOne(value);

        if (!found) {
          await this.model.create(value);
        }
      };
    });

    await Promise.all(promiseAllList);
  }
}
