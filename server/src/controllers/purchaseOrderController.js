import {
  createPurchaseOrder,
  getPurchaseOrderByNumber,
  getPurchaseOrders
} from "../services/purchaseOrderService.js";
import ActionLog from "../models/ActionLog.js";

import { validatePurchaseOrderProposal } from "../services/validationService.js";

import { validatePurchaseOrderResult } from "../services/resultValidationService.js";

export const validatePurchaseOrder = async (req, res) => {
  try {
    const {
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice
    } = req.body;

    const result = await validatePurchaseOrderProposal({
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Purchase order validation failed",
      error: error.message
    });
  }
};

export const createApprovedPurchaseOrder = async (req, res) => {
  let actionLog = null;

  try {
    const {
      recommendationId = null,
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice,
      approvalStatus
    } = req.body;

    if (!productId || !nodeId || !supplierId) {
      return res.status(400).json({
        success: false,
        message: "productId, nodeId and supplierId are required"
      });
    }

    if (approvalStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Human approval is required before creating a purchase order"
      });
    }

    const proposedAction = {
      actionType: "CREATE_PO",
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice
    };

    const validationResult = await validatePurchaseOrderProposal({
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice
    });

    actionLog = await ActionLog.create({
      actionId: `ACTION-${Date.now()}`,
      recommendationId,
      actionType: "CREATE_PO",
      proposedAction,
      validationBeforeExecution: validationResult,
      approvalStatus: "APPROVED",
      status: validationResult.valid
        ? "APPROVED"
        : "FAILED_VALIDATION"
    });

    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: "Purchase order proposal failed validation",
        validation: validationResult,
        actionId: actionLog.actionId
      });
    }

    const purchaseOrder = await createPurchaseOrder({
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice,
      source: "AI_AGENT"
    });

    actionLog.status = "EXECUTED";
    actionLog.executionResult = purchaseOrder;

  const resultValidation = await validatePurchaseOrderResult({
  poNumber: purchaseOrder.poNumber,
  approvedProposal: {
    productId,
    nodeId,
    supplierId,
    quantity,
    unitPrice
  }
});

    actionLog.validationAfterExecution = resultValidation;

    if (!resultValidation.valid) {
      actionLog.status = "FAILED_VALIDATION";

      await actionLog.save();

      return res.status(500).json({
        success: false,
        message: "Purchase order was created but failed post-action validation",
        purchaseOrder,
        validation: resultValidation,
        actionId: actionLog.actionId
      });
    }

    actionLog.status = "COMPLETED";
    await actionLog.save();

    res.status(201).json({
      success: true,
      message: "Purchase order created successfully",
      actionId: actionLog.actionId,
      purchaseOrder,
      validation: resultValidation
    });
  } catch (error) {
    if (actionLog) {
      actionLog.status = "FAILED";
      actionLog.executionResult = {
        error: error.message
      };

      await actionLog.save();
    }

    res.status(500).json({
      success: false,
      message: "Failed to create purchase order",
      error: error.message,
      actionId: actionLog?.actionId || null
    });
  }
};

export const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await getPurchaseOrders();

    res.json({
      success: true,
      count: purchaseOrders.length,
      data: purchaseOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase orders",
      error: error.message
    });
  }
};

export const getPurchaseOrder = async (req, res) => {
  try {
    const { poNumber } = req.params;

    const purchaseOrder = await getPurchaseOrderByNumber(poNumber);

    res.json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};