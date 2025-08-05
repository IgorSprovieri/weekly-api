import { colorsModel } from "../models/colors";
import type { Request, Response } from "express";

class ColorController {
  async get(req: Request, res: Response) {
    try {
      const colors = await colorsModel.find();

      return res.status(200).json(colors);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }
}

export const colorController = new ColorController();
