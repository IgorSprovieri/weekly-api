const mongoose = require("mongoose");
const sessionsListSchema = require("../schemas/session");

module.exports = mongoose.model("sessions", sessionsListSchema);
