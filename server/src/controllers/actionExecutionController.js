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

export const executeApprovedAction = async (req, res) => {
  let actionLog = null;

  try {
    const { actionId } = req.params;

    actionLog = await ActionLog.findOne({
      actionId
    });

    if (!actionLog) {
      return res.status(404).json({
        success: false,
        message: "Action not found"
      });
    }

    if (actionLog.approvalStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Action must be approved before execution"
      });
    }

    if (
      actionLog.status === "COMPLETED" ||
      actionLog.status === "EXECUTED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Action has already been executed"
      });
    }

    const proposedAction = actionLog.proposedAction;

    const approvedProposal = {
      productId: proposedAction.productId,
      nodeId: proposedAction.nodeId,
      supplierId: proposedAction.supplierId,
      quantity: proposedAction.quantity,
      unitPrice: proposedAction.unitPrice
    };

    // Validate immediately before execution
    const validationResult =
      await validatePurchaseOrderProposal(approvedProposal);

    actionLog.validationBeforeExecution = validationResult;

    if (!validationResult.valid) {
      actionLog.status = "FAILED_VALIDATION";

      await actionLog.save();

      return res.status(400).json({
        success: false,
        message: "Action failed pre-execution validation",
        validation: validationResult,
        actionId
      });
    }

    // Create the purchase order
    const purchaseOrder = await createPurchaseOrder({
      ...approvedProposal,
      source: "AI_AGENT"
    });

    actionLog.status = "EXECUTED";
    actionLog.executionResult = {
      success: true,
      poNumber: purchaseOrder.poNumber,
      purchaseOrder
    };

    // Validate the created PO against the approved proposal
    const resultValidation =
      await validatePurchaseOrderResult({
        poNumber: purchaseOrder.poNumber,
        approvedProposal
      });

    actionLog.validationAfterExecution = resultValidation;

    if (!resultValidation.valid) {
      actionLog.status = "FAILED_VALIDATION";

      await actionLog.save();

      return res.status(500).json({
        success: false,
        message:
          "PO created but failed post-execution validation",
        purchaseOrder,
        validation: resultValidation,
        actionId
      });
    }

    actionLog.status = "COMPLETED";

    await actionLog.save();

    return res.status(201).json({
      success: true,
      message: "Approved action executed successfully",
      actionId,
      purchaseOrder,
      validation: resultValidation
    });
  } catch (error) {
    console.error("Execute approved action error:", error);

    if (actionLog) {
      actionLog.status = "FAILED";
      actionLog.executionResult = {
        success: false,
        error: error.message
      };

      await actionLog.save();
    }

    return res.status(500).json({
      success: false,
      message: "Failed to execute action",
      error: error.message
    });
  }
};