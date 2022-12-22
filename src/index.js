const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const port = 3000;

async function connectDatabase() {
  await mongoose.connect("mongodb://localhost:27017");
}

const tasksListSchema = new mongoose.Schema({
  name: String,
  initialDate: { type: Date, default: Date.now },
  time: Date,
  description: String,
  checked: Boolean,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  connectDatabase().catch((error) => {
    console.log(`Error to connect database`);
  });
  console.log(`App listening on port ${port}`);
});
