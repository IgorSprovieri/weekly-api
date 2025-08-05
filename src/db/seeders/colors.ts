import { Seeder } from "./Seeder";
import { colorsModel } from "../../models/colors";

class ColorsSeed extends Seeder<{ hexColor?: string }> {
  constructor() {
    const model = colorsModel;
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

export const colorsSeed = new ColorsSeed();
