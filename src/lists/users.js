const mongoose = require("mongoose");
const userListSchema = require("../schemas/user");

module.exports = mongoose.model("users", userListSchema);
