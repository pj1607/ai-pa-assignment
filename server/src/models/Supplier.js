import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    leadTimeDays: {
      type: Number,
      required: true,
      min: 0
    },

    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1
    },

    orderMultiple: {
      type: Number,
      required: true,
      min: 1
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;