const mongoose = require("mongoose");

const usersListSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  token: String,
  tokenValidity: Date,
});

module.exports = mongoose.model("users", usersListSchema);
