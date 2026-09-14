import ActionLog from "../models/ActionLog.js";

export const getAllActionLogs = async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch action logs",
      error: error.message
    });
  }
};

export const getActionLogById = async (req, res) => {
  try {
    const { actionId } = req.params;

    const log = await ActionLog.findOne({
      actionId
    }).lean();

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Action log not found"
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch action log",
      error: error.message
    });
  }
};

export const getPendingActions = async (req, res) => {
  try {
    const actions = await ActionLog.find({
      approvalStatus: "PENDING",
      status: "PROPOSED"
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: actions.length,
      data: actions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending actions",
      error: error.message
    });
  }
};