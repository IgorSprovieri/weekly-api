require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const app = express();

app.use(express.json());

const port = Number(process.env.PORT);

async function connectDatabase() {
  await mongoose.connect(process.env.DATABASE_URL);
}

app.get("/", function (req, res) {
  res.send("It is a task manager API called weekly");
});

app.listen(port, () => {
  console.log(process.env);
  mongoose.set("strictQuery", true);
  connectDatabase().catch((error) => {
    console.log(error);
  });
  app.use("/task", taskRoutes);
  app.use("/user", userRoutes);
  app.use("/login", loginRoutes);
  console.log(`App listening on port ${port}`);
});
