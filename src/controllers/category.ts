import { validations } from "../libs/validation";
import { commonErrors } from "../libs/commonErrors";
import { categoriesModel } from "../models/categories";

import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth";

class CategoryController {
  async post(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { name, hexColor } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Category name is required" });
      }

      if (!hexColor || !validations.validateHexColor(hexColor)) {
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

  async get(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      const categories = await categoriesModel.find({ user_id: userId });

      return res.status(200).json(categories);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async put(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.userId;
      const { name, hexColor } = req.body;

      if (hexColor && !validations.validateHexColor(hexColor)) {
        return res.status(400).json({ error: "hexColor is invalid" });
      }

      const categoryFound = await categoriesModel.findById(id);

      if (!categoryFound) {
        return commonErrors.notFound({ res, nameInLowerCase: "category" });
      }

      if (categoryFound?.user_id?.toString() !== userId) {
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

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.userId;

      const categoryFound = await categoriesModel.findById(id);

      if (!categoryFound) {
        return commonErrors.notFound({ res, nameInLowerCase: "category" });
      }

      if (categoryFound?.user_id?.toString() !== userId) {
        return commonErrors.forbidden({ res, nameInLowerCase: "category" });
      }

      const deletedCategory = await categoriesModel.findByIdAndRemove(id);

      return res.status(200).json(deletedCategory);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }
}

export const categoryController = new CategoryController();
