const mongoose = require("mongoose");

const validateEmail = function (email) {
  if (!email.includes("@") || !email.includes(".")) {
    return false;
  }
  return true;
};

function checkOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

const validatePassword = function (password) {
  if (checkOnlyNumbers(password) == false) {
    return false;
  }
  return true;
};

const usersListSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    minlength: 3,
    required: [true, "is required"],
    validate: [validateEmail, "invalid"],
  },
  password: {
    type: String,
    required: [true, "is required"],
    validate: [validatePassword, "invalid"],
    minlength: 4,
    maxlength: 4,
    default: "xxxx",
  },
  passwordHash: {
    type: String,
  },
});

module.exports = usersListSchema;
