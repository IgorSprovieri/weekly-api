const mongoose = require("mongoose");

const sessionsListSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: [true, "is necessary"] },
  token: {
    type: String,
    required: [true, "is required"],
  },
});

module.exports = sessionsListSchema;
