import { validations } from "../libs/validation";
import { commonErrors } from "../libs/commonErrors";
import { SubTask, tasksModel } from "../models/tasks";

import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth";

class TaskController {
  async post(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      const { initialDate, finalDate } = req.body;
      const { task, category, description, subTasks, checked } = req.body;

      if (!category?.name || !category?.hexColor) {
        return res.status(400).json({ error: "Category is invalid" });
      }

      if (!validations.validateHexColor(category.hexColor)) {
        return res.status(400).json({ error: "Category color is invalid" });
      }

      if (!initialDate || !validations.validateDate(initialDate)) {
        return res.status(400).json({ error: "Initial date is invalid" });
      }

      if (!finalDate || !validations.validateDate(finalDate)) {
        return res.status(400).json({ error: "Final date is invalid" });
      }

      if (subTasks && subTasks.length > 0) {
        subTasks?.forEach((subTask: SubTask) => {
          if (!subTask?.task) {
            return res.status(400).json({ error: "Subtask is invalid" });
          }

          if (!validations.validateBool(subTask?.checked)) {
            return res.status(400).json({ error: "Subtask is invalid" });
          }
        });
      }

      if (checked) {
        if (!validations.validateBool(checked)) {
          return res.status(400).json({ error: "Checked is invalid" });
        }
      }

      let initialDateTest = new Date(req.body.initialDate);
      let finalDateTest = new Date(req.body.finalDate);

      if (initialDateTest > finalDateTest) {
        return res
          .status(400)
          .json({ error: "Final date must be greater than start date" });
      }

      if (initialDateTest.getDate() != finalDateTest.getDate()) {
        return res.status(400).json({ error: "The task overcomming the day" });
      }

      const newTask = await tasksModel.create({
        user_id: userId,
        category: category,
        task: task,
        initialDate: initialDate,
        finalDate: finalDate,
        description: description,
        subTasks: subTasks,
        checked: checked,
      });

      return res.status(201).json(newTask);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async get(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { initialDate, finalDate } = req.query;

      let initialDateTest = new Date(String(initialDate)).toISOString;
      let finalDateTest = new Date(String(finalDate)).toISOString;

      if (!initialDate || !validations.validateDate(String(initialDate))) {
        return res.status(400).json({ error: "Initial date is invalid" });
      }

      if (!finalDate || !validations.validateDate(String(finalDate))) {
        return res.status(400).json({ error: "Final date is invalid" });
      }

      if (initialDateTest > finalDateTest) {
        return res
          .status(400)
          .json({ error: "Final date must be greater than start date" });
      }

      const tasks = await tasksModel
        .find({
          user_id: userId,
          initialDate: {
            $gte: initialDate,
            $lt: finalDate,
          },
        })
        .sort({ initialDate: 1 })
        .exec();

      return res.status(200).json(tasks);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async put(req: AuthRequest, res: Response) {
    try {
      const { initialDate, finalDate } = req.body;
      const { task, category, hexColor, description, subTasks, checked } =
        req.body;

      const id = req.params.id;
      const userId = req.userId;

      if (!id || !validations.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      if (category) {
        if (!category?.name || !category?.hexColor) {
          return res.status(400).json({ error: "Category is invalid" });
        }

        if (!validations.validateHexColor(category.hexColor)) {
          return res.status(400).json({ error: "Category color is invalid" });
        }
      }

      if (initialDate) {
        if (!validations.validateDate(initialDate)) {
          return res.status(400).json({ error: "Initial date is invalid" });
        }
      }

      if (finalDate) {
        if (!validations.validateDate(finalDate)) {
          return res.status(400).json({ error: "Final date is invalid" });
        }
      }

      if (hexColor) {
        if (!validations.validateHexColor(hexColor)) {
          return res.status(400).json({ error: "Hex color is invalid" });
        }
      }

      if (subTasks && subTasks.length > 0) {
        subTasks?.forEach((subTask: SubTask) => {
          if (!subTask?.task) {
            return res.status(400).json({ error: "Subtask is invalid" });
          }

          if (!validations.validateBool(subTask.checked)) {
            return res.status(400).json({ error: "Subtask is invalid" });
          }
        });
      }

      if (checked) {
        if (!validations.validateBool(checked)) {
          return res.status(400).json({ error: "Final date is invalid" });
        }
      }

      const taskFound = await tasksModel.findById(id);

      if (!taskFound) {
        return commonErrors.notFound({ res, nameInLowerCase: "task" });
      }

      if (taskFound.user_id?.toString() !== userId) {
        return commonErrors.forbidden({ res, nameInLowerCase: "task" });
      }

      const updatedTask = await tasksModel.findByIdAndUpdate(
        id,
        {
          task: task,
          hexColor: hexColor,
          initialDate: initialDate,
          finalDate: finalDate,
          description: description,
          checked: checked,
        },
        {
          new: true,
        }
      );
      return res.status(200).json(updatedTask);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id;
      const userId = req.userId;

      if (!id || !validations.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      const taskFound = await tasksModel.findById(id);

      if (!taskFound) {
        return commonErrors.notFound({ res, nameInLowerCase: "task" });
      }

      if (taskFound.user_id?.toString() !== userId) {
        return commonErrors.forbidden({ res, nameInLowerCase: "task" });
      }

      const deletedTask = await tasksModel.findByIdAndRemove(id);
      return res.status(200).json(deletedTask);
    } catch (error) {
      return commonErrors.internalServerError({ res });
    }
  }
}

export const taskController = new TaskController();
