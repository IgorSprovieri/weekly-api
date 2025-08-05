const mongoose = require("mongoose");
const config = require("../config/index");
const enviroment = process.env.ENVIROMENT;
const { colorsSeed } = require("./seeders/colors");

const connectDatabase = async () => {
  await mongoose.connect(config[enviroment].database);
};

const runSeeds = async () => {
  await colorsSeed.createSeedsOnDB();
};

module.exports = { connectDatabase, runSeeds };
