const mongoose = require("mongoose");

const taskListSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  task: { type: String, default: " " },
  hexColor: {
    type: String,
    default: "#FFFFFF",
  },
  initialDate: Date,
  finalDate: Date,
  description: { type: String, default: " " },
  subTasks: { type: [{ task: String, checked: Boolean }], default: [] },
  checked: { type: Boolean, default: false },
});

module.exports = mongoose.model("tasks", taskListSchema);
