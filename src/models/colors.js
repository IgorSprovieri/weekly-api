const mongoose = require("mongoose");

const colorsSchema = new mongoose.Schema({
  hexColor: {
    type: String,
  },
});

module.exports = mongoose.model("colors", colorsSchema);
