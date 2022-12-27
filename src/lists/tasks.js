const mongoose = require("mongoose");
const taskListSchema = require("../schemas/task");

module.exports = mongoose.model("tasks", taskListSchema);
