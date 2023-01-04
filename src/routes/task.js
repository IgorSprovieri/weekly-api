const express = require("express");
const router = express.Router();
const validation = require("../validation");
const tasksList = require("../models/tasks");
const usersList = require("../models/users");

router.get("/", async (req, res) => {
  try {
    const currentEmail = req.headers.email;
    const { initialDate, finalDate } = req.body;
    let initialDateTest = new Date(initialDate);
    let finalDateTest = new Date(finalDate);

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (!initialDate || !validation.validateDate(initialDate)) {
      return res.status(400).json({ error: "Initial date is invalid" });
    }

    if (!finalDate || !validation.validateDate(finalDate)) {
      return res.status(400).json({ error: "Final date is invalid" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    if (initialDateTest.getDate() > finalDateTest.getDate()) {
      return res
        .status(400)
        .json({ error: "Final date must be greater than start date" });
    }

    const tasks = await tasksList
      .find({
        user_id: userFound[0]._id,
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
    return res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const currentEmail = req.headers.email;
    const { name, initialDate, finalDate, description, checked } = req.body;

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (!initialDate || !validation.validateDate(initialDate)) {
      return res.status(400).json({ error: "Initial date is invalid" });
    }

    if (!finalDate || !validation.validateDate(finalDate)) {
      return res.status(400).json({ error: "Final date is invalid" });
    }

    if (checked) {
      if (!validation.validateBool(checked)) {
        return res.status(400).json({ error: "Final date is invalid" });
      }
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
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
      user_id: userFound[0]._id,
      name: name,
      initialDate: initialDate,
      finalDate: finalDate,
      description: description,
      checked: checked,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const currentEmail = req.headers.email;

    if (!id || !validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const taskFound = await tasksList.findById(id);

    if (!taskFound) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (!taskFound.user_id.equals(userFound[0]._id)) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskDeleted = await tasksList.findByIdAndRemove(id);
    return res.status(200).json(taskDeleted);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, initialDate, finalDate, description, checked } = req.body;
    const id = req.params.id;
    const currentEmail = req.headers.email;

    if (!id || !validation.validateIdObject(id)) {
      return res.status(400).json({ error: "Id is invalid" });
    }

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (!currentEmail || !validation.validateEmail(currentEmail)) {
      return res.status(400).json({ error: "E-mail is invalid" });
    }

    if (initialDate) {
      if (!initialDate || !validation.validateDate(initialDate)) {
        return res.status(400).json({ error: "Initial date is invalid" });
      }
    }

    if (finalDate) {
      if (!validation.validateDate(finalDate)) {
        return res.status(400).json({ error: "Final date is invalid" });
      }
    }

    if (checked) {
      if (!validation.validateBool(checked)) {
        return res.status(400).json({ error: "Final date is invalid" });
      }
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    const taskFound = await tasksList.findById(id);

    if (!taskFound) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (!taskFound.user_id.equals(userFound[0]._id)) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskUpdated = await tasksList.findByIdAndUpdate(
      id,
      {
        name: name,
        initialDate: initialDate,
        finalDate: finalDate,
        description: description,
        checked: checked,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(taskUpdated);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
