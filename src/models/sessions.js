const mongoose = require("mongoose");

const sessionsListSchema = new mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  name: String,
  createdOn: Date,
});

module.exports = mongoose.model("sessions", sessionsListSchema);
