const { validateHexColor } = require("../libs/validation");
const categoriesList = require("../models/categories");

class categoryController {
  async post(req, res) {
    try {
      const userId = req.userId;
      const { name, hexColor } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }

      if (!hexColor || !validateHexColor(hexColor)) {
        return res.status(400).json({ error: "hexColor is invalid" });
      }

      const newCategory = await categoriesList.create({
        user_id: userId,
        name: name,
        hexColor: hexColor,
      });

      return res.status(201).json(newCategory);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new categoryController();
