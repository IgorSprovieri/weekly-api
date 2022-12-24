const express = require("express");
const router = express.Router();
const tasksList = require("../schemas/tasksList");
const checkToken = require("../checkToken");

router.get("/", async (req, res) => {
  try {
    const { user_id, initialDate, finalDate } = req.body;
    let initialDateTest = new Date(initialDate);
    let finalDateTest = new Date(finalDate);
    const token = req.headers.token;

    if (!user_id || !initialDate || !finalDate) {
      return res.status(400).json({ error: "Missing information on body" });
    }

    if (!token) {
      return res.status(400).json({ error: "Token is missing" });
    }

    const checkTokenResponse = await checkToken(user_id, token);

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
  try {
    const { user_id, name, initialDate, finalDate, description, checked } =
      req.body;
    const token = req.headers.token;

    if (
      !user_id ||
      !name ||
      !initialDate ||
      !finalDate ||
      !description ||
      !checked
    ) {
      return res.status(400).json({ error: "Missing information on body" });
    }

    if (!token) {
      return res.status(400).json({ error: "Token is missing" });
    }

    if (checked != "true" && checked != "false") {
      return res.status(400).json({ error: "Checked is boolean" });
    }

    const checkTokenResponse = await checkToken(user_id, token);

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
  try {
    const user_id = req.body.user_id;
    const id = req.params.id;
    const token = req.headers.token;

    if (!user_id || !id || !token) {
      return res.status(400).json({ error: "Missing information" });
    }

    const checkTokenResponse = await checkToken(user_id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskFound = await tasksList.findById(id);

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
    const { user_id, name, initialDate, finalDate, description, checked } =
      req.body;
    const id = req.params.id;
    const token = req.headers.token;

    if (!id || !token) {
      return res.status(400).json({ error: "Missing information" });
    }

    if (checked) {
      if (checked != "true" && checked != "false") {
        return res.status(400).json({ error: "Checked is boolean" });
      }
    }

    const checkTokenResponse = await checkToken(user_id, token);

    if (checkTokenResponse == false) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskFound = await tasksList.findById(id);

    if (taskFound[0].user_id != userFound[0].id) {
      return res.status(403).json({ error: "Aceess denied" });
    }

    const taskUpdated = await tasksList.findByIdAndUpdate(
      id,
      {
        user_id: userFound[0].id,
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
