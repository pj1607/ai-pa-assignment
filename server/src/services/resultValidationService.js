import PurchaseOrder from "../models/PurchaseOrder.js";

export const validatePurchaseOrderResult = async ({
  poNumber,
  approvedProposal
}) => {
  const errors = [];

  const purchaseOrder = await PurchaseOrder.findOne({
    poNumber
  }).lean();

  if (!purchaseOrder) {
    return {
      valid: false,
      errors: ["Created purchase order was not found"]
    };
  }

  if (purchaseOrder.productId !== approvedProposal.productId) {
    errors.push("Product does not match approved proposal");
  }

  if (purchaseOrder.nodeId !== approvedProposal.nodeId) {
    errors.push("Node does not match approved proposal");
  }

  if (purchaseOrder.supplierId !== approvedProposal.supplierId) {
    errors.push("Supplier does not match approved proposal");
  }

  if (purchaseOrder.quantity !== approvedProposal.quantity) {
    errors.push("Quantity does not match approved proposal");
  }

  if (purchaseOrder.unitPrice !== approvedProposal.unitPrice) {
    errors.push("Unit price does not match approved proposal");
  }

  const expectedTotalCost =
    approvedProposal.quantity * approvedProposal.unitPrice;

  if (purchaseOrder.totalCost !== expectedTotalCost) {
    errors.push("Total cost does not match approved proposal");
  }

  if (purchaseOrder.status !== "OPEN") {
    errors.push("Purchase order status is not OPEN");
  }

  return {
    valid: errors.length === 0,
    errors,
    purchaseOrder
  };
};
