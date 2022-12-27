const mongoose = require("mongoose");

const tasksListSchema = new mongoose.Schema({
  user_id: { type: String, required: [true, "is necessary"] },
  name: { type: String, required: [true, "is necessary"] },
  initialDate: { type: Date, required: [true, "is necessary"] },
  finalDate: { type: Date, required: [true, "is necessary"] },
  description: { type: String, required: [true, "is necessary"] },
  checked: { type: Boolean, required: [true, "is necessary"] },
});

module.exports = mongoose.model("tasks", tasksListSchema);
