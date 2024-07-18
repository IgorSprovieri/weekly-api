const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema(
  { task: String, checked: Boolean },
  { _id: false }
);

const taskSchema = new mongoose.Schema({
  uid: String,
  task: { type: String, default: " " },
  hexColor: { type: String, default: "#39526C" },
  initialDate: Date,
  finalDate: Date,
  description: { type: String, default: " " },
  subTasks: [subTaskSchema],
  checked: { type: Boolean, default: false },
});

module.exports = mongoose.model("tasks", taskSchema);
