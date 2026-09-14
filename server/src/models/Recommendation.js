import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    recommendationId: {
      type: String,
      required: true,
      unique: true
    },

    productId: {
      type: String,
      required: true
    },

    nodeId: {
      type: String,
      required: true
    },

    supplierId: {
      type: String,
      required: true
    },

    recommendedQuantity: {
      type: Number,
      required: true,
      min: 1
    },

    reason: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "EXECUTED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);

export default Recommendation;