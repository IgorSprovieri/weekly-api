const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const app = express();

app.use(express.json());
app.use("/static", express.static(__dirname + "/public"));

const port = 3333;

async function connectDatabase() {
  await mongoose.connect("mongodb://localhost:27017");
}

app.get("/", function (req, res) {
  res.send("It is a task manager API called weekly");
});

app.listen(port, () => {
  mongoose.set("strictQuery", true);
  connectDatabase().catch((error) => {
    console.log(error);
  });
  app.use("/task", taskRoutes);
  app.use("/user", userRoutes);
  app.use("/login", loginRoutes);
  console.log(`App listening on port ${port}`);
});
