const mongoose = require("mongoose");
const appColorsSchema = require("../schemas/color");

module.exports = mongoose.model("colors", appColorsSchema);
