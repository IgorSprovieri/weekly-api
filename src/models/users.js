const mongoose = require("mongoose");

const usersListSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "User Name",
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    default: "",
  },
  passwordHash: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordTokenCratedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("users", usersListSchema);
