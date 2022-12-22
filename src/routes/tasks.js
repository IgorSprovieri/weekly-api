const express = require("express");
const router = express.Router();
const listTask = require("../schemas/listTask");

router.get("/", async (req, res) => {
  try {
    let initialDateTest = new Date(req.body.initialDate);
    let finalDateTest = new Date(req.body.finalDate);

    if (initialDateTest.getDate() > finalDateTest.getDate()) {
      return res
        .status(400)
        .json({ error: "Final date must be greater than start date" });
    }

    const tasks = await listTask
      .find({
        initialDate: {
          $gte: req.body.initialDate,
          $lt: req.body.finalDate,
        },
      })
      .exec();

    const sortedTasks = tasks.sort(function (n1, n2) {
      return n1.initialDate - n2.initialDate;
    });

    return res.status(200).json(sortedTasks);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    let initialDateTest = new Date(req.body.initialDate);
    let finalDateTest = new Date(req.body.finalDate);

    if (initialDateTest.getDate() > finalDateTest.getDate()) {
      return res
        .status(400)
        .json({ error: "Final date must be greater than start date" });
    }

    if (initialDateTest.getDate() != finalDateTest.getDate()) {
      return res.status(400).json({ error: "The task overcomming the day" });
    }

    const newTask = await listTask.create({
      name: req.body.name,
      initialDate: req.body.initialDate,
      finalDate: req.body.finalDate,
      description: req.body.description,
      checked: req.body.checked,
    });

    return res.status(200).json(newTask);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const taskDeleted = await listTask.findByIdAndRemove(req.params.id);
    return res.status(200).json(taskDeleted);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const taskUpdated = await listTask.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        initialDate: req.body.initialDate,
        finalDate: req.body.finalDate,
        description: req.body.description,
        checked: req.body.checked,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(taskUpdated);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
