import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
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

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    totalCost: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "PARTIALLY_FULFILLED",
        "FULFILLED",
        "CANCELLED"
      ],
      default: "OPEN"
    },

    expectedDeliveryDate: {
      type: Date
    },

    source: {
      type: String,
      enum: ["EXISTING", "AI_AGENT"],
      default: "AI_AGENT"
    }
  },
  {
    timestamps: true
  }
);

const PurchaseOrder = mongoose.model(
  "PurchaseOrder",
  purchaseOrderSchema
);

export default PurchaseOrder;
