import { addDays } from "date-fns";
import type { Request, Response } from "express";

class AppController {
  async getAddDays(req: Request, res: Response) {
    try {
      const { date, days } = req.query;

      const finalDate = addDays(new Date(String(date)), Number(days));

      return res.status(200).json(finalDate);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }

  async getListOfDays(req: Request, res: Response) {
    try {
      const { date, days } = req.query;

      if (Number(days) <= 0) {
        return res.status(400).json({ error: "Invalid days" });
      }

      const listOfDays = [];
      let dateAux = new Date(String());
      for (let i = 0; i < Number(days); i++) {
        listOfDays.push(dateAux.toISOString().split("T")[0]);
        dateAux = addDays(dateAux, 1);
      }

      return res.status(200).json(listOfDays);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }
}

export const appController = new AppController();
