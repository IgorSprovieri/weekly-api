require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Routes = require("./routes/index");
const config = require("./config/index");
const enviroment = process.env.ENVIROMENT;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", Routes);

const port = config[enviroment].port;

async function connectDatabase() {
  await mongoose.connect(config[enviroment].database);
}

app.listen(port, () => {
  mongoose.set("strictQuery", true);
  connectDatabase().catch((error) => {
    console.log(error);
  });
  console.log(`App listening on port ${port}`);
});
