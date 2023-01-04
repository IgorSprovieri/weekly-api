const mongoose = require("mongoose");

const appColorsSchema = new mongoose.Schema({
  hexColor: {
    type: String,
  },
});

module.exports = mongoose.model("colors", appColorsSchema);
