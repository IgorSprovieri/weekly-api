const colorsModel = require("../models/colors");

class ColorController {
  async get(req, res) {
    try {
      const colors = await colorsModel.find();

      return res.status(200).json(colors);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }
}

module.exports = new ColorController();
