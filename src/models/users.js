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
  loginAttempts: {
    Type: Number,
    default: 0,
  },
  resetPasswordSecureId: {
    type: String,
    default: "null",
  },
  resetPasswordToken: {
    type: String,
    default: "null",
  },
});

module.exports = mongoose.model("users", usersListSchema);
