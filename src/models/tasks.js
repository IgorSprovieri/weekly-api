const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema(
  { task: String, checked: Boolean },
  { _id: false }
);

const taskListSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  task: { type: String, default: " " },
  category: { name: String, hexColor: String },
  initialDate: Date,
  finalDate: Date,
  description: { type: String, default: " " },
  subTasks: [subTaskSchema],
  checked: { type: Boolean, default: false },
});

module.exports = mongoose.model("tasks", taskListSchema);
