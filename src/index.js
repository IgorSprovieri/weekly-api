require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const routers = require("./routers/index");

const { connectDatabase } = require("./db");

const app = express();

app.use(cors({ origin: process.env.CORS_URL || "*" }));
app.use(express.json());
app.use("/", routers);

const port = process.env.PORT || 3333;

app.listen(port, "0.0.0.0", async () => {
  try {
    mongoose.set("strictQuery", true);
    await connectDatabase();
    console.log(`App listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
