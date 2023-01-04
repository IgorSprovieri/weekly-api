const mongoose = require("mongoose");

const usersListSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "User Name",
  },
  email: {
    type: String,
  },
  passwordHash: {
    type: String,
  },
});

module.exports = mongoose.model("users", usersListSchema);
