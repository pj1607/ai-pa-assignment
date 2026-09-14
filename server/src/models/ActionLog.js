import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    actionId: {
      type: String,
      required: true,
      unique: true
    },

    recommendationId: {
      type: String,
      default: null
    },

    actionType: {
      type: String,
      enum: ["NONE", "CREATE_PO"],
      required: true
    },

    proposedAction: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    validationBeforeExecution: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    approvalStatus: {
      type: String,
      enum: [
        "NOT_REQUIRED",
        "PENDING",
        "APPROVED",
        "REJECTED"
      ],
      default: "PENDING"
    },

    approvedBy: {
      type: String,
      default: null
    },

    approvedAt: {
      type: Date,
      default: null
    },

    executionResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    validationAfterExecution: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    status: {
      type: String,
      enum: [
        "PROPOSED",
        "APPROVED",
        "EXECUTED",
        "COMPLETED",
        "FAILED",
        "FAILED_VALIDATION",
        "REJECTED"
      ],
      default: "PROPOSED"
    }
  },
  {
    timestamps: true
  }
);

const ActionLog = mongoose.model("ActionLog", actionLogSchema);

export default ActionLog;