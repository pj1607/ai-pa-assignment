import {
  getRecommendation,
  getProduct,
  getInventory,
  getForecast,
  getOpenPurchaseOrders,
  getSupplierConditions,
  getBudget,
  getStorageCapacity
} from "../services/toolService.js";

import { validatePurchaseOrderProposal } from "../services/validationService.js";

export const reviewPurchasingRecommendation = async (
  recommendationId
) => {
  // Step 1: Fetch recommendation
  const recommendation = await getRecommendation(recommendationId);

  // Step 2: Fetch product information
  const product = await getProduct(recommendation.productId);

  // Step 3: Investigate inventory
  const inventory = await getInventory(
    recommendation.productId,
    recommendation.nodeId
  );

  // Step 4: Investigate demand forecast
  const forecast = await getForecast(
    recommendation.productId,
    recommendation.nodeId
  );

  // Step 5: Investigate incoming purchase orders
  const openPurchaseOrders = await getOpenPurchaseOrders(
    recommendation.productId,
    recommendation.nodeId
  );

  // Step 6: Investigate supplier conditions
  const supplier = await getSupplierConditions(
    recommendation.supplierId
  );

  // Step 7: Check budget
  const budget = await getBudget(recommendation.nodeId);

  // Step 8: Check storage
  const storage = await getStorageCapacity(
    recommendation.nodeId
  );

  // Step 9: Calculate inventory position
  const inventoryPosition =
    inventory.availableQuantity +
    openPurchaseOrders.totalIncomingQuantity;

  // Step 10: Calculate additional requirement
  const additionalRequirement = Math.max(
    0,
    forecast.expectedDemand - inventoryPosition
  );

  let decision = "INVESTIGATE";
  let recommendedQuantity = 0;
  let reasoning = [];
  let investigationRequired = false;

  // Case 1: Existing inventory and incoming stock are enough
  if (additionalRequirement === 0) {
    decision = "REJECTED";
    recommendedQuantity = 0;

    reasoning.push(
      "Current inventory and incoming purchase orders are sufficient to cover expected demand."
    );
  } else {
    // Start with the actual additional requirement
    recommendedQuantity = additionalRequirement;

    reasoning.push(
      `Additional requirement calculated as ${additionalRequirement} units.`
    );

    // Apply supplier MOQ
    if (
      recommendedQuantity < supplier.minimumOrderQuantity
    ) {
      recommendedQuantity = supplier.minimumOrderQuantity;

      reasoning.push(
        `Quantity increased to supplier MOQ of ${supplier.minimumOrderQuantity}.`
      );
    }

    // Apply order multiple
    const remainder =
      recommendedQuantity % supplier.orderMultiple;

    if (remainder !== 0) {
      recommendedQuantity +=
        supplier.orderMultiple - remainder;

      reasoning.push(
        `Quantity adjusted to order multiple of ${supplier.orderMultiple}.`
      );
    }

    // Check supplier availability
    if (
      recommendedQuantity > supplier.availableQuantity
    ) {
      decision = "INVESTIGATE";
      investigationRequired = true;

      reasoning.push(
        "Supplier cannot provide the calculated quantity."
      );
    }

    // Check budget
    const estimatedCost =
      recommendedQuantity * supplier.unitPrice;

    if (estimatedCost > budget.availableBudget) {
      decision = "INVESTIGATE";
      investigationRequired = true;

      reasoning.push(
        `Estimated cost ${estimatedCost} exceeds available budget ${budget.availableBudget}.`
      );
    }

    // Check storage
    if (
      recommendedQuantity > storage.availableStorageCapacity
    ) {
      decision = "INVESTIGATE";
      investigationRequired = true;

      reasoning.push(
        `Required quantity ${recommendedQuantity} exceeds available storage capacity ${storage.availableStorageCapacity}.`
      );
    }

    if (!investigationRequired) {
      decision = "MODIFIED";

      if (
        recommendedQuantity ===
        recommendation.recommendedQuantity
      ) {
        decision = "ACCEPTED";
      }

      reasoning.push(
        "Proposed quantity satisfies supplier, budget, and storage constraints."
      );
    }
  }

  let validation = null;

  if (
    decision === "ACCEPTED" ||
    decision === "MODIFIED"
  ) {
    validation = await validatePurchaseOrderProposal({
      productId: recommendation.productId,
      nodeId: recommendation.nodeId,
      supplierId: recommendation.supplierId,
      quantity: recommendedQuantity,
      unitPrice: supplier.unitPrice
    });

    if (!validation.valid) {
      decision = "INVESTIGATE";
      investigationRequired = true;

      reasoning.push(
        "Final backend validation failed."
      );
    }
  }

  return {
    recommendation,
    investigation: {
      product,
      inventory,
      forecast,
      openPurchaseOrders,
      supplier,
      budget,
      storage,
      inventoryPosition,
      additionalRequirement
    },
    decision,
    recommendedQuantity,
    supplierId: recommendation.supplierId,
    unitPrice: supplier.unitPrice,
    reasoning,
    constraintsChecked: [
      {
        name: "Inventory",
        status: "PASS",
        details: `Available inventory: ${inventory.availableQuantity}`
      },
      {
        name: "Incoming purchase orders",
        status: "PASS",
        details: `Incoming quantity: ${openPurchaseOrders.totalIncomingQuantity}`
      },
      {
        name: "Demand forecast",
        status: "PASS",
        details: `Expected demand: ${forecast.expectedDemand}`
      },
      {
        name: "Supplier availability",
        status:
          recommendedQuantity <= supplier.availableQuantity
            ? "PASS"
            : "FAIL",
        details: `Supplier can provide ${supplier.availableQuantity} units`
      },
      {
        name: "Budget",
        status:
          recommendedQuantity * supplier.unitPrice <=
          budget.availableBudget
            ? "PASS"
            : "FAIL",
        details: `Estimated cost: ₹${
          recommendedQuantity * supplier.unitPrice
        }, available budget: ₹${budget.availableBudget}`
      },
      {
        name: "Storage",
        status:
          recommendedQuantity <=
          storage.availableStorageCapacity
            ? "PASS"
            : "FAIL",
        details: `Available storage: ${storage.availableStorageCapacity}`
      }
    ],
    action: {
      type:
        decision === "ACCEPTED" ||
        decision === "MODIFIED"
          ? "CREATE_PO"
          : "NONE",
      requiresApproval:
        decision === "ACCEPTED" ||
        decision === "MODIFIED"
    },
    validation
  };
};