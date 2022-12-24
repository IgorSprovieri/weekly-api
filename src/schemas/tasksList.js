const mongoose = require("mongoose");

const tasksListSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  initialDate: Date,
  finalDate: Date,
  description: String,
  checked: Boolean,
});

module.exports = mongoose.model("tasks", tasksListSchema);
