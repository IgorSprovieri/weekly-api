const express = require("express");
const router = express.Router();
const tasksList = require("../schemas/tasksList");
const usersList = require("../schemas/tasksList");

async function checkToken(email, token) {
  const userFounded = await usersList.find({ token: token });

  if (!userFounded) {
    return false;
  }

  const today = new Date();

  if (userFounded.tokenValidity < today) {
    return false;
  }

  if (email != userFounded.email) {
    return false;
  }

  return true;
}

router.get("/", async (req, res) => {
  try {
    let initialDateTest = new Date(req.body.initialDate);
    let finalDateTest = new Date(req.body.finalDate);
    const currentEmail = req.headers.email;
    const token = req.headers.token;

    if (checkToken(currentEmail, token) == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    if (initialDateTest.getDate() > finalDateTest.getDate()) {
      return res
        .status(400)
        .json({ error: "Final date must be greater than start date" });
    }

    const tasks = await tasksList
      .find({
        user_email: currentEmail,
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
    return res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, name, initialDate, finalDate, description, checked } =
      req.body;
    const currentEmail = req.headers.email;
    const token = req.headers.token;

    if (checkToken(currentEmail, token) == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

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

    const newTask = await tasksList.create({
      user_email: currentEmail,
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
  try {
    const id = req.params.id;
    const currentEmail = req.headers.email;
    const token = req.headers.token;

    if (checkToken(currentEmail, token) == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskFounded = await tasksList.find({ id: id });

    if (taskFounded.user_email != currentEmail) {
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
    const token = req.headers.token;

    if (checkToken(currentEmail, token) == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskFounded = await tasksList.find({ id: id });

    if (taskFounded.user_email != currentEmail) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskUpdated = await tasksList.findByIdAndUpdate(
      id,
      {
        user_email: currentEmail,
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
