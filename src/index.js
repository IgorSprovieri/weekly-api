const express = require("express");
const mongoose = require("mongoose");
const { lastDayOfMonth } = require("date-fns");
const app = express();
app.use(express.json());

const port = 3333;

async function connectDatabase() {
  await mongoose.connect("mongodb://localhost:27017");
}

const tasksListSchema = new mongoose.Schema({
  name: String,
  initialDate: Date,
  finalDate: Date,
  description: String,
  checked: Boolean,
});

const listTask = mongoose.model("tasks", tasksListSchema);

app.get("/tasks", async (req, res) => {
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

app.post("/task", async (req, res) => {
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  mongoose.set("strictQuery", true);
  connectDatabase().catch((error) => {
    console.log(error);
  });
  console.log(`App listening on port ${port}`);
});
