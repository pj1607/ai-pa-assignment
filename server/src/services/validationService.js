import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import Node from "../models/Node.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

export const validatePurchaseOrderProposal = async ({
  productId,
  nodeId,
  supplierId,
  quantity,
  unitPrice
}) => {
  const errors = [];
  const warnings = [];

  const product = await Product.findOne({
    productId
  }).lean();

  const supplier = await Supplier.findOne({
    supplierId
  }).lean();

  const node = await Node.findOne({
    nodeId
  }).lean();

  if (!product) {
    errors.push("Product does not exist");
  }

  if (!supplier) {
    errors.push("Supplier does not exist");
  }

  if (!node) {
    errors.push("Fulfilment node does not exist");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      warnings
    };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.push("Quantity must be greater than zero");
  }

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    errors.push("Unit price must be zero or greater");
  }

  if (quantity < supplier.minimumOrderQuantity) {
    errors.push(
      `Quantity must be at least ${supplier.minimumOrderQuantity}`
    );
  }

  if (quantity % supplier.orderMultiple !== 0) {
    errors.push(
      `Quantity must be a multiple of ${supplier.orderMultiple}`
    );
  }

  if (quantity > supplier.availableQuantity) {
    errors.push(
      `Supplier can provide only ${supplier.availableQuantity} units`
    );
  }

  const totalCost = quantity * unitPrice;

  if (totalCost > node.availableBudget) {
    errors.push(
      `Purchase cost ${totalCost} exceeds available budget ${node.availableBudget}`
    );
  }

  if (quantity > node.availableStorageCapacity) {
    errors.push(
      `Quantity ${quantity} exceeds available storage capacity ${node.availableStorageCapacity}`
    );
  }

  const duplicatePurchaseOrder = await PurchaseOrder.findOne({
    productId,
    nodeId,
    supplierId,
    status: {
      $in: ["OPEN", "PARTIALLY_FULFILLED"]
    }
  }).lean();

  if (duplicatePurchaseOrder) {
    warnings.push(
      `An existing open purchase order already exists: ${duplicatePurchaseOrder.poNumber}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    calculated: {
      totalCost,
      quantity,
      unitPrice
    },
    checked: {
      productId,
      nodeId,
      supplierId
    }
  };
};