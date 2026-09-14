import Recommendation from "../models/Recommendation.js";
import Inventory from "../models/Inventory.js";
import Forecast from "../models/Forecast.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import Node from "../models/Node.js";
import Product from "../models/Product.js";

export const getRecommendation = async (recommendationId) => {
  const recommendation = await Recommendation.findOne({
    recommendationId
  }).lean();

  if (!recommendation) {
    throw new Error("Recommendation not found");
  }

  return recommendation;
};

export const getInventory = async (productId, nodeId) => {
  const inventory = await Inventory.findOne({
    productId,
    nodeId
  }).lean();

  if (!inventory) {
    return {
      productId,
      nodeId,
      currentQuantity: 0,
      reservedQuantity: 0,
      availableQuantity: 0
    };
  }

  return {
    ...inventory,
    availableQuantity:
      inventory.currentQuantity - inventory.reservedQuantity
  };
};

export const getForecast = async (productId, nodeId) => {
  const forecast = await Forecast.findOne({
    productId,
    nodeId
  })
    .sort({ updatedAt: -1 })
    .lean();

  if (!forecast) {
    throw new Error("Forecast not found");
  }

  return forecast;
};

export const getOpenPurchaseOrders = async (productId, nodeId) => {
  const purchaseOrders = await PurchaseOrder.find({
    productId,
    nodeId,
    status: {
      $in: ["OPEN", "PARTIALLY_FULFILLED"]
    }
  }).lean();

  const totalIncomingQuantity = purchaseOrders.reduce(
    (total, purchaseOrder) => total + purchaseOrder.quantity,
    0
  );

  return {
    purchaseOrders,
    totalIncomingQuantity
  };
};

export const getSupplierConditions = async (supplierId) => {
  const supplier = await Supplier.findOne({
    supplierId
  }).lean();

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
};

export const getBudget = async (nodeId) => {
  const node = await Node.findOne({
    nodeId
  }).lean();

  if (!node) {
    throw new Error("Node not found");
  }

  return {
    nodeId,
    availableBudget: node.availableBudget
  };
};

export const getStorageCapacity = async (nodeId) => {
  const node = await Node.findOne({
    nodeId
  }).lean();

  if (!node) {
    throw new Error("Node not found");
  }

  return {
    nodeId,
    totalStorageCapacity: node.totalStorageCapacity,
    availableStorageCapacity: node.availableStorageCapacity
  };
};

export const getProduct = async (productId) => {
  const product = await Product.findOne({
    productId
  }).lean();

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};