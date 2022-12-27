require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const sessionRoutes = require("./routes/session");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = Number(process.env.PORT);

async function connectDatabase() {
  await mongoose.connect(process.env.DATABASE_URL);
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
  app.use("/session", sessionRoutes);
  console.log(`App listening on port ${port}`);
});
