const mongoose = require("mongoose");

const sessionsListSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  token: String,
  createdAt: Date,
});

module.exports = mongoose.model("sessions", sessionsListSchema);
