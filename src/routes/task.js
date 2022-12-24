const express = require("express");
const router = express.Router();
const tasksList = require("../schemas/tasksList");
const usersList = require("../schemas/usersList");
const checkToken = require("../checkToken");

router.get("/", async (req, res) => {
  try {
    let initialDateTest = new Date(req.body.initialDate);
    let finalDateTest = new Date(req.body.finalDate);
    const currentEmail = req.headers.email;
    const token = req.headers.token;

    if (!req.body.initialDateTest || !req.body.finalDateTest) {
      return res.status(400).json({ error: "Missing information on body" });
    }

    if (!req.params.id || !req.headers.email || req.headers.token) {
      return res.status(400).json({ error: "Missing information" });
    }

    if (
      currentEmail.length < 3 ||
      !currentEmail.includes("@") ||
      !currentEmail.includes(".")
    ) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(userFound[0].id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    if (initialDateTest.getDate() > finalDateTest.getDate()) {
      return res
        .status(400)
        .json({ error: "Final date must be greater than start date" });
    }

    const tasks = await tasksList
      .find({
        user_id: userFound[0].id,
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
    const { name, initialDate, finalDate, description, checked } = req.body;
    const currentEmail = req.headers.email;
    const token = req.headers.token;

    if (
      !req.body.name ||
      !req.body.initialDate ||
      !req.body.finalDate ||
      !req.body.description ||
      !req.body.checked
    ) {
      return res.status(400).json({ error: "Missing information on body" });
    }

    if (!req.params.id || !req.headers.email || req.headers.token) {
      return res.status(400).json({ error: "Missing information" });
    }

    if (
      currentEmail.length < 3 ||
      !currentEmail.includes("@") ||
      !currentEmail.includes(".")
    ) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(userFound[0].id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
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
      user_id: userFound[0].id,
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

    if (!req.params.id || !req.headers.email || req.headers.token) {
      return res.status(400).json({ error: "Missing information" });
    }

    if (
      currentEmail.length < 3 ||
      !currentEmail.includes("@") ||
      !currentEmail.includes(".")
    ) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(userFound[0].id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskFound = await tasksList.find({ id: id });

    if (taskFound[0].user_id != userFound[0].id) {
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

    if (!req.params.id || !req.headers.email || req.headers.token) {
      return res.status(400).json({ error: "Missing information" });
    }

    if (
      currentEmail.length < 3 ||
      !currentEmail.includes("@") ||
      !currentEmail.includes(".")
    ) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const userFound = await usersList.find({ email: currentEmail });

    if (!userFound[0]) {
      return res.status(400).json({ error: "User not found" });
    }

    const checkTokenResponse = await checkToken(userFound[0].id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskFound = await tasksList.find({ id: id });

    if (taskFound[0].user_id != userFound[0].id) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskUpdated = await tasksList.findByIdAndUpdate(
      id,
      {
        user_id: userFound[0].id,
        name: name || taskFound[0].name,
        initialDate: initialDate || taskFound[0].nainitialDateme,
        finalDate: finalDate || taskFound[0].finalDate,
        description: description || taskFound[0].description,
        checked: checked || taskFound[0].checked,
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
