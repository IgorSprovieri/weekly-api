const mongoose = require("mongoose");

const usersListSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  token: String,
  //editAccountToken: String,
});

module.exports = mongoose.model("users", usersListSchema);
