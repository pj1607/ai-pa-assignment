import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },

    nodeId: {
      type: String,
      required: true
    },

    currentQuantity: {
      type: Number,
      required: true,
      min: 0
    },

    reservedQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
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

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;