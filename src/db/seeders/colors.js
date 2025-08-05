const { Seeder } = require(".");
const colors = require("../../models/colors");

class ColorsSeed extends Seeder {
  #model;
  values;

  constructor() {
    const model = colors;
    const values = [
      {
        hexColor: "#FFFFFF",
      },
      {
        hexColor: "#000000",
      },
      {
        hexColor: "#39526C",
      },
      {
        hexColor: "#FFA07A",
      },
      {
        hexColor: "#00A07A",
      },
      {
        hexColor: "#7A87FF",
      },
      {
        hexColor: "#FF7A7A",
      },
      {
        hexColor: "#00B0B0",
      },
    ];

    super({ model, values });
  }
}

module.exports = { colorsSeed: new ColorsSeed() };
