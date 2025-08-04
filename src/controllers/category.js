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

  async get(req, res) {
    try {
      const userId = req.userId;

      const categories = await categoriesList.find({ user_id: userId });

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async put(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const { name, hexColor } = req.body;

      if (hexColor && !validateHexColor(hexColor)) {
        return res.status(400).json({ error: "hexColor is invalid" });
      }

      const categoryFound = await categoriesList.findById(id);

      if (!categoryFound) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (!categoryFound.user_id.equals(userId)) {
        return res.status(401).json({ error: "Aceess denied" });
      }

      const updatedCategory = await categoriesList.findByIdAndUpdate(
        id,
        {
          name: name,
          hexColor: hexColor,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId;

      const categoryFound = await categoriesList.findById(id);

      if (!categoryFound) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (!categoryFound.user_id.equals(userId)) {
        return res.status(401).json({ error: "Aceess denied" });
      }

      const deletedCategory = await categoriesList.findByIdAndRemove(id);

      return res.status(200).json(deletedCategory);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new categoryController();
