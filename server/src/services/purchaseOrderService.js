import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import Node from "../models/Node.js";

export const createPurchaseOrder = async ({
  productId,
  nodeId,
  supplierId,
  quantity,
  unitPrice,
  source = "AI_AGENT"
}) => {
  const supplier = await Supplier.findOne({
    supplierId
  });

  const node = await Node.findOne({
    nodeId
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  if (!node) {
    throw new Error("Node not found");
  }

  const poNumber = `PO-AI-${Date.now()}`;

  const totalCost = quantity * unitPrice;

  const expectedDeliveryDate = new Date(
    Date.now() + supplier.leadTimeDays * 24 * 60 * 60 * 1000
  );

  const purchaseOrder = await PurchaseOrder.create({
    poNumber,
    productId,
    nodeId,
    supplierId,
    quantity,
    unitPrice,
    totalCost,
    status: "OPEN",
    expectedDeliveryDate,
    source
  });

  return purchaseOrder;
};

export const getPurchaseOrderByNumber = async (poNumber) => {
  const purchaseOrder = await PurchaseOrder.findOne({
    poNumber
  }).lean();

  if (!purchaseOrder) {
    throw new Error("Purchase order not found");
  }

  return purchaseOrder;
};

export const getPurchaseOrders = async () => {
  return PurchaseOrder.find().sort({
    createdAt: -1
  });
};