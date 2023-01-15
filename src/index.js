require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Routes = require("./routes/index");

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

app.listen(port, () => {
  mongoose.set("strictQuery", true);
  connectDatabase().catch((error) => {
    console.log(error);
  });
  console.log(`App listening on port ${port}`);
  app.use("/", Routes);
});
