class Seeder {
  #model;
  values;

  constructor({ model, values }) {
    this.#model = model;
    this.values = values;
  }

  async createSeedsOnDB() {
    const promiseAllList = this.values.map(({ value }) => {
      return async () => {
        const found = await this.list.findOne(value);

        if (!found) {
          await this.list.create(value);
        }
      };
    });

    await Promise.all(promiseAllList);
  }
}

module.exports = { Seeder };
