import ActionLog from "../models/ActionLog.js";

import {
  createPurchaseOrder
} from "../services/purchaseOrderService.js";

import {
  validatePurchaseOrderProposal
} from "../services/validationService.js";

import {
  validatePurchaseOrderResult
} from "../services/resultValidationService.js";

export const approveAction = async (req, res) => {
  try {
    const { actionId } = req.params;
    const { approvedBy = "HUMAN_USER" } = req.body;

    const actionLog = await ActionLog.findOne({
      actionId
    });

    if (!actionLog) {
      return res.status(404).json({
        success: false,
        message: "Action not found"
      });
    }

    if (actionLog.approvalStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Action cannot be approved because its current approval status is ${actionLog.approvalStatus}`
      });
    }

    actionLog.approvalStatus = "APPROVED";
    actionLog.approvedBy = approvedBy;
    actionLog.approvedAt = new Date();
    actionLog.status = "APPROVED";

    await actionLog.save();

    res.json({
      success: true,
      message: "Action approved successfully",
      data: actionLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve action",
      error: error.message
    });
  }
};

export const rejectAction = async (req, res) => {
  try {
    const { actionId } = req.params;

    const actionLog = await ActionLog.findOne({
      actionId
    });

    if (!actionLog) {
      return res.status(404).json({
        success: false,
        message: "Action not found"
      });
    }

    if (actionLog.approvalStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Action cannot be rejected because its current approval status is ${actionLog.approvalStatus}`
      });
    }

    actionLog.approvalStatus = "REJECTED";
    actionLog.status = "REJECTED";

    await actionLog.save();

    res.json({
      success: true,
      message: "Action rejected successfully",
      data: actionLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject action",
      error: error.message
    });
  }
};