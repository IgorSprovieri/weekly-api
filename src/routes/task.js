const express = require("express");
const router = express.Router();
const tasksList = require("../lists/tasks");
const usersList = require("../lists/users");

router.get("/", async (req, res) => {
  const user_id = req.headers.user_id;
  const { initialDate, finalDate } = req.body;
  let initialDateTest = new Date(initialDate);
  let finalDateTest = new Date(finalDate);

  if (!user_id) {
    return res.status(400).json({ error: "User id is mandatory" });
  }

  try {
    await tasksList.validate({
      user_id: user_id,
      initialDate: initialDate,
      finalDate: finalDate,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    if (initialDateTest.getDate() > finalDateTest.getDate()) {
      return res
        .status(400)
        .json({ error: "Final date must be greater than start date" });
    }

    const tasks = await tasksList
      .find({
        user_id: user_id,
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
  const user_id = req.headers.user_id;
  const { name, initialDate, finalDate, description, checked } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "User id is mandatory" });
  }

  try {
    await tasksList.validate({
      user_id: user_id,
      name: name,
      initialDate: initialDate,
      finalDate: finalDate,
      description: description,
      checked: checked,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const userExists = await usersList.exists({ _id: id });

    if (!userExists) {
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
      user_id: user_id,
      name: name,
      initialDate: initialDate,
      finalDate: finalDate,
      description: description,
      checked: checked,
    });

    return res.status(200).json(newTask);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  const user_id = req.headers.user_id;
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Id is mandatory" });
  }

  if (!user_id) {
    return res.status(400).json({ error: "User id is mandatory" });
  }

  try {
    await tasksList.validate({
      _id: id,
      user_id: user_id,
      initialDate: new Date(),
      finalDate: new Date(),
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const taskFound = await tasksList.findById(id);

    if (!taskFound) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (taskFound.user_id != user_id) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskDeleted = await tasksList.findByIdAndRemove(id);
    return res.status(200).json(taskDeleted);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  const { name, initialDate, finalDate, description, checked } = req.body;
  const id = req.params.id;
  const user_id = req.headers.user_id;

  if (!user_id) {
    return res.status(400).json({ error: "User id is mandatory" });
  }

  try {
    await tasksList.validate({
      _id: id,
      user_id: user_id,
      name: name,
      initialDate: initialDate || new Date(),
      finalDate: finalDate || new Date(),
      description: description,
      checked: checked,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }

  try {
    const taskFound = await tasksList.findById(id);

    if (!taskFound) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (taskFound.user_id != user_id) {
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
