const mongoose = require("mongoose");

const tasksListSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: [true, "is necessary"] },
  name: { type: String, default: " " },
  initialDate: { type: Date, required: [true, "is necessary"] },
  finalDate: { type: Date, required: [true, "is necessary"] },
  description: { type: String, default: " " },
  checked: { type: Boolean, default: false },
});

module.exports = tasksListSchema;
