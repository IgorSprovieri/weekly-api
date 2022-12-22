const mongoose = require("mongoose");

const tasksListSchema = new mongoose.Schema({
  name: String,
  initialDate: Date,
  finalDate: Date,
  description: String,
  checked: Boolean,
});

module.exports = mongoose.model("tasks", tasksListSchema);
