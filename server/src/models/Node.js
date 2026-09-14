import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    totalStorageCapacity: {
      type: Number,
      required: true,
      min: 0
    },

    availableStorageCapacity: {
      type: Number,
      required: true,
      min: 0
    },

    availableBudget: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Node = mongoose.model("Node", nodeSchema);

export default Node;