const mongoose = require("mongoose");
const { Schema } = mongoose;

const travelPlanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TravelPlan", travelPlanSchema);
