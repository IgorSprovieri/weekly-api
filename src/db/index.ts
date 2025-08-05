import { connect } from "mongoose";
import { config } from "../config";
import { enviroment } from "../config/enviroment";
import { colorsSeed } from "./seeders/colors";

export const connectDatabase = async () => {
  await connect(config[enviroment.ENVIROMENT].database);
};

export const runSeeds = async () => {
  await colorsSeed.createSeedsOnDB();
};
