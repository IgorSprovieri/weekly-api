require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config/index");
const enviroment = process.env.ENVIROMENT;
const Routes = require("./routes/index");
const { connectDatabase, colorsSeed } = require("./db");
const app = express();

const corsOptions = {
  origin: "https://weekly.ispapps.com",
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

    for (let i = 0; i < colorsSeed.values.length; i++) {
      const found = await colorsSeed.list.findOne(colorsSeed.values[i]);

      if (!found) {
        await colorsSeed.list.create(colorsSeed.values[i]);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
