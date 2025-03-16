const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    influencerName: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    company: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tracking", trackingSchema);


