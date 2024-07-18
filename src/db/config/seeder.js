const { colorsSeed } = require("../seeds/colors");

const seeder = async () => {
  try {
    for (let i = 0; i < colorsSeed.values.length; i++) {
      const found = await colorsSeed.model.findOne(colorsSeed.values[i]);

      if (!found) {
        await colorsSeed.list.create(colorsSeed.values[i]);
      }
    }

    return;
  } catch (error) {
    throw new Error("Error during seeding: ", error);
  }
};

seeder();
