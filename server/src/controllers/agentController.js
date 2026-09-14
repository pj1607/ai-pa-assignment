import {
  reviewPurchasingRecommendation
} from "../agent/purchasingAgent.js";

import AgentRun from "../models/AgentRun.js";
import ActionLog from "../models/ActionLog.js";

export const reviewRecommendation = async (req, res) => {
  let agentRun = null;

  try {
    const { recommendationId } = req.body;

    if (!recommendationId) {
      return res.status(400).json({
        success: false,
        message: "recommendationId is required"
      });
    }

    const runId = `RUN-${Date.now()}`;

    agentRun = await AgentRun.create({
      runId,
      recommendationId,
      status: "RUNNING",
      toolCalls: [
        "getRecommendation",
        "getProduct",
        "getInventory",
        "getForecast",
        "getOpenPurchaseOrders",
        "getSupplierConditions",
        "getBudget",
        "getStorageCapacity"
      ]
    });

    const result = await reviewPurchasingRecommendation(
      recommendationId
    );

    agentRun.status = "COMPLETED";
    agentRun.decision = {
      decision: result.decision,
      recommendedQuantity: result.recommendedQuantity,
      supplierId: result.supplierId,
      action: result.action,
      reasoning: result.reasoning
    };
    agentRun.completedAt = new Date();

    await agentRun.save();

    let actionLog = null;

    if (
      result.action?.type === "CREATE_PO" &&
      result.action?.requiresApproval === true
    ) {
      actionLog = await ActionLog.create({
        actionId: `ACTION-${Date.now()}`,
        recommendationId,
        actionType: "CREATE_PO",
        proposedAction: {
          productId: result.recommendation.productId,
          nodeId: result.recommendation.nodeId,
          supplierId: result.supplierId,
          quantity: result.recommendedQuantity,
          unitPrice: result.unitPrice
        },
        validationBeforeExecution: result.validation,
        approvalStatus: "PENDING",
        status: "PROPOSED"
      });
    }

    res.json({
      success: true,
      runId,
      actionId: actionLog?.actionId || null,
      data: result
    });
  } catch (error) {
    if (agentRun) {
      agentRun.status = "FAILED";
      agentRun.error = error.message;
      agentRun.completedAt = new Date();

      await agentRun.save();
    }

    res.status(500).json({
      success: false,
      message: "Agent review failed",
      error: error.message,
      runId: agentRun?.runId || null
    });
  }
};