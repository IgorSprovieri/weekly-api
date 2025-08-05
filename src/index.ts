import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { enviroment } from "./config/enviroment";
import { routes } from "./routes";
import { connectDatabase, runSeeds } from "./db";
import { json } from "express";

const app = express();
const port = enviroment.PORT || 3333;

app.use(
  cors({ origin: enviroment.ENVIROMENT === "prod" ? enviroment.CORS_URL : "*" })
);

app.use(json());
app.use("/", routes);

app.listen(port, "0.0.0.0", async () => {
  try {
    console.log(`Initialyzing Server`);
    mongoose.set("strictQuery", true);

    console.log(`Connecting to DB`);
    await connectDatabase();
    console.log(`DB Connected`);

    console.log(`Running seeds`);
    await runSeeds();
    console.log(`Finished to run seeds`);

    console.log(`App listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
