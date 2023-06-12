require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Routes = require("./routes/index");
const config = require("./config/index");
const enviroment = process.env.ENVIROMENT;
const app = express();

const corsOptions = {
  origin: "https://weekly.ispapps.com",
};

app.use(cors(enviroment === "prod" ? corsOptions : "*"));
app.use(express.json());
app.use("/", Routes);

const port = process.env.PORT || 3333;

async function connectDatabase() {
  await mongoose.connect(config[enviroment].database);
}

app.listen(port, "0.0.0.0", async () => {
  try {
    mongoose.set("strictQuery", true);
    await connectDatabase();
    console.log(`App listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
