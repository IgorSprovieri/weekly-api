const mongoose = require("mongoose");

const validateColor = function (hexColor) {
  return /^#[0-9A-F]{6}$/i.test(hexColor);
};

const appColorsSchema = new mongoose.Schema({
  hexColor: {
    type: String,
    required: true,
    validate: [validateColor, "invalid"],
  },
});

module.exports = appColorsSchema;
