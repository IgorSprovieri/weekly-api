const mongoose = require("mongoose");
const config = require("../config/index");
const enviroment = process.env.ENVIROMENT;

const { colorsSeed } = require("./seeds/colors");

async function connectDatabase() {
  await mongoose.connect(config[enviroment].database);
}

module.exports = { connectDatabase, colorsSeed };
