const appColorsList = require("../models/colors");
const validation = require("../libs/validation");

class colorController {
  async get(req, res) {
    try {
      const colors = await appColorsList.find();

      return res.status(200).json(colors);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new colorController();
