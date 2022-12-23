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
  res.redirect("/home");
});

app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/public/Home/index.html");
});
app.get("/home/style.css", function (req, res) {
  res.sendFile(__dirname + "/public/Home/style.css");
});
app.get("/home/index.js", (req, res) => {
  res.sendFile(__dirname + "/public/Home/index.js");
});

app.get("/application", function (req, res) {
  res.sendFile(__dirname + "/public/App/index.html");
});
app.get("/application/style.css", function (req, res) {
  res.sendFile(__dirname + "/public/App/style.css");
});
app.get("/application/index.js", (req, res) => {
  res.sendFile(__dirname + "/public/App/index.js");
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
