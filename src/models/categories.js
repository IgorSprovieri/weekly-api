const mongoose = require("mongoose");

const categoriesListSchema = mongoose.Schema({
  user_id: mongoose.Types.ObjectId,
  name: { type: String },
  hexColor: {
    type: String,
    default: "#39526C",
  },
});

module.exports = mongoose.model("categories", categoriesListSchema);
