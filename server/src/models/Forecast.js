import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },

    nodeId: {
      type: String,
      required: true
    },

    horizonDays: {
      type: Number,
      required: true,
      min: 1
    },

    expectedDemand: {
      type: Number,
      required: true,
      min: 0
    },

    averageDailyDemand: {
      type: Number,
      required: true,
      min: 0
    },

    forecastVersion: {
      type: String,
      required: true
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Forecast = mongoose.model("Forecast", forecastSchema);

export default Forecast;
