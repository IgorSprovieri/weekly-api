const validation = require("../libs/validation");
const categories = require("../models/categories");
const tasksList = require("../models/tasks");

class taskController {
  async post(req, res) {
    try {
      const userId = req.userId;
      const { initialDate, finalDate } = req.body;
      const { task, category, description, subTasks, checked } = req.body;

      if (!category?.name || category?.hexColor) {
        if (!validation.validateHexColor(category.hexColor)) {
          return res.status(400).json({ error: "Category is invalid" });
        }
      }

      if (!validation.validateHexColor(category.hexColor)) {
        return res.status(400).json({ error: "Category color is invalid" });
      }

      if (!initialDate || !validation.validateDate(initialDate)) {
        return res.status(400).json({ error: "Initial date is invalid" });
      }

      if (!finalDate || !validation.validateDate(finalDate)) {
        return res.status(400).json({ error: "Final date is invalid" });
      }

      if (subTasks && subTasks.length > 0) {
        subTasks.forEach((subTask) => {
          if (!subTask?.task || !subTask?.checked) {
            return res.status(400).json({ error: "Subtask is invalid" });
          }

          if (!validation.validateBool(subTask.checked)) {
            return res
              .status(400)
              .json({ error: "Subtask checked is invalid" });
          }
        });
      }

      if (checked) {
        if (!validation.validateBool(checked)) {
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

      const newTask = await tasksList.create({
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
      return res.status(500).json({ error: error?.message });
    }
  }

  async get(req, res) {
    try {
      const userId = req.userId;
      const { initialDate, finalDate } = req.query;
      let initialDateTest = new Date(initialDate).toISOString;
      let finalDateTest = new Date(finalDate).toISOString;

      if (!initialDate || !validation.validateDate(initialDate)) {
        return res.status(400).json({ error: "Initial date is invalid" });
      }

      if (!finalDate || !validation.validateDate(finalDate)) {
        return res.status(400).json({ error: "Final date is invalid" });
      }

      if (initialDateTest > finalDateTest) {
        return res
          .status(400)
          .json({ error: "Final date must be greater than start date" });
      }

      const tasks = await tasksList
        .find({
          user_id: userId,
          initialDate: {
            $gte: initialDate,
            $lt: finalDate,
          },
        })
        .exec();

      const sortedTasks = tasks.sort(function (n1, n2) {
        return n1.initialDate - n2.initialDate;
      });

      return res.status(200).json(sortedTasks);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }

  async put(req, res) {
    try {
      const { initialDate, finalDate } = req.body;
      const { task, category, hexColor, description, subTasks, checked } =
        req.body;
      const id = req.params.id;
      const userId = req.userId;

      if (!id || !validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      if (category) {
        if (!category?.name || category?.hexColor) {
          if (!validation.validateHexColor(category.hexColor)) {
            return res.status(400).json({ error: "Category is invalid" });
          }
        }

        if (!validation.validateHexColor(category.hexColor)) {
          return res.status(400).json({ error: "Category color is invalid" });
        }
      }

      if (initialDate) {
        if (!validation.validateDate(initialDate)) {
          return res.status(400).json({ error: "Initial date is invalid" });
        }
      }

      if (finalDate) {
        if (!validation.validateDate(finalDate)) {
          return res.status(400).json({ error: "Final date is invalid" });
        }
      }

      if (hexColor) {
        if (!validation.validateHexColor(hexColor)) {
          return res.status(400).json({ error: "Hex color is invalid" });
        }
      }

      if (subTasks && subTasks.length > 0) {
        if (!subTasks.task || !subTasks.checked) {
          return res.status(400).json({ error: "Subtask is invalid" });
        }

        subTasks?.forEach((subTask) => {
          if (!validation.validateBool(subTask?.checked)) {
            return res
              .status(400)
              .json({ error: "Subtask checked is invalid" });
          }
        });
      }

      if (checked) {
        if (!validation.validateBool(checked)) {
          return res.status(400).json({ error: "Final date is invalid" });
        }
      }

      const taskFound = await tasksList.findById(id);

      if (!taskFound) {
        return res.status(404).json({ error: "Task not found" });
      }

      if (!taskFound.user_id.equals(userId)) {
        return res.status(401).json({ error: "Aceess denied" });
      }

      const updatedTask = await tasksList.findByIdAndUpdate(
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
      return res.status(500).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const userId = req.userId;

      if (!id || !validation.validateIdObject(id)) {
        return res.status(400).json({ error: "Id is invalid" });
      }

      const taskFound = await tasksList.findById(id);

      if (!taskFound) {
        return res.status(404).json({ error: "Task not found" });
      }

      if (!taskFound.user_id.equals(userId)) {
        return res.status(401).json({ error: "Aceess denied" });
      }

      const deletedTask = await tasksList.findByIdAndRemove(id);
      return res.status(200).json(deletedTask);
    } catch (error) {
      return res.status(500).json({ error: error?.message });
    }
  }
}

module.exports = new taskController();
