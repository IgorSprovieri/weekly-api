require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const enviroment = process.env.ENVIROMENT;
const Routes = require("./routes/index");
const { connectDatabase, colorsSeed, runSeeds } = require("./db");
const app = express();

const corsOptions = {
  origin: process.env.CORS_URL,
};

app.use(cors(enviroment === "prod" ? corsOptions : "*"));
app.use(express.json());
app.use("/", Routes);

const port = process.env.PORT || 3333;

app.listen(port, "0.0.0.0", async () => {
  try {
    mongoose.set("strictQuery", true);

    await connectDatabase();
    console.log(`App listening on port ${port}`);

    await runSeeds();
    console.log(`Finished to run seeds`);
  } catch (error) {
    console.log(error);
  }
});
