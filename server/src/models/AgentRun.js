import mongoose from "mongoose";

const agentRunSchema = new mongoose.Schema(
  {
    runId: {
      type: String,
      required: true,
      unique: true
    },

    recommendationId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["RUNNING", "COMPLETED", "FAILED"],
      default: "RUNNING"
    },

    toolCalls: {
      type: [String],
      default: []
    },

    decision: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    error: {
      type: String,
      default: null
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const AgentRun = mongoose.model("AgentRun", agentRunSchema);

export default AgentRun;