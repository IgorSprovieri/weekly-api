const commonErrors = require("../libs/commonErrors");
const validation = require("../libs/validation");
const categoriesModel = require("../models/categories");

class CategoryController {
  async post(req, res) {
    try {
      const userId = req.userId;
      const { name, hexColor } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }

      if (!hexColor || !validation.validateHexColor(hexColor)) {
        return res.status(400).json({ error: "hexColor is invalid" });
      }

      const createdCategory = await categoriesModel.create({
        user_id: userId,
        name: name,
        hexColor: hexColor,
      });

      return res.status(201).json(createdCategory);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async get(req, res) {
    try {
      const userId = req.userId;

      const categories = await categoriesModel.find({ user_id: userId });

      return res.status(200).json(categories);
    } catch (error) {
      return commonErrors.internalServerError({ res });
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

      const categoryFound = await categoriesModel.findById(id);

      if (!categoryFound) {
        return commonErrors.notFound({ res, nameInLowerCase: "category" });
      }

      if (!categoryFound.user_id.equals(userId)) {
        return commonErrors.forbidden({ res, nameInLowerCase: "category" });
      }

      const updatedCategory = await categoriesModel.findByIdAndUpdate(
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
      return commonErrors.internalServerError({ res });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId;

      const categoryFound = await categoriesModel.findById(id);

      if (!categoryFound) {
        return commonErrors.notFound({ res, nameInLowerCase: "category" });
      }

      if (!categoryFound.user_id.equals(userId)) {
        return commonErrors.forbidden({ res, nameInLowerCase: "category" });
      }

      const deletedCategory = await categoriesModel.findByIdAndRemove(id);

      return res.status(200).json(deletedCategory);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }
}

module.exports = new CategoryController();
