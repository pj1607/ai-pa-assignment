import AgentRun from "../models/AgentRun.js";

export const getAllAgentRuns = async (req, res) => {
  try {
    const runs = await AgentRun.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: runs.length,
      data: runs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch agent runs",
      error: error.message
    });
  }
};

export const getAgentRunById = async (req, res) => {
  try {
    const { runId } = req.params;

    const run = await AgentRun.findOne({
      runId
    }).lean();

    if (!run) {
      return res.status(404).json({
        success: false,
        message: "Agent run not found"
      });
    }

    res.json({
      success: true,
      data: run
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch agent run",
      error: error.message
    });
  }
};