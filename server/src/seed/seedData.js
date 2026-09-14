import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Product from "../models/Product.js";
import Node from "../models/Node.js";
import Supplier from "../models/Supplier.js";
import Inventory from "../models/Inventory.js";
import Forecast from "../models/Forecast.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import Recommendation from "../models/Recommendation.js";

dotenv.config();

const products = [
  {
    productId: "P001",
    name: "Coca-Cola 500ml",
    sku: "COKE-500",
    category: "Beverages",
    unit: "piece"
  },
  {
    productId: "P002",
    name: "Amul Milk 1L",
    sku: "AMUL-MILK-1L",
    category: "Dairy",
    unit: "piece"
  },
  {
    productId: "P003",
    name: "Dove Shampoo 180ml",
    sku: "DOVE-180",
    category: "Personal Care",
    unit: "piece"
  }
];

const nodes = [
  {
    nodeId: "N001",
    name: "Delhi Fulfilment Center",
    city: "Delhi",
    totalStorageCapacity: 2000,
    availableStorageCapacity: 1000,
    availableBudget: 60000
  },
  {
    nodeId: "N002",
    name: "Gurgaon Fulfilment Center",
    city: "Gurgaon",
    totalStorageCapacity: 1500,
    availableStorageCapacity: 800,
    availableBudget: 40000
  }
];

const suppliers = [
  {
    supplierId: "S001",
    name: "Supplier A",
    leadTimeDays: 3,
    minimumOrderQuantity: 500,
    orderMultiple: 100,
    unitPrice: 100,
    availableQuantity: 1000,
    status: "ACTIVE"
  },
  {
    supplierId: "S002",
    name: "Supplier B",
    leadTimeDays: 2,
    minimumOrderQuantity: 100,
    orderMultiple: 50,
    unitPrice: 110,
    availableQuantity: 2000,
    status: "ACTIVE"
  },
  {
    supplierId: "S003",
    name: "Supplier C",
    leadTimeDays: 5,
    minimumOrderQuantity: 200,
    orderMultiple: 100,
    unitPrice: 90,
    availableQuantity: 500,
    status: "ACTIVE"
  }
];

const inventory = [
  {
    productId: "P001",
    nodeId: "N001",
    currentQuantity: 100,
    reservedQuantity: 0
  },
  {
    productId: "P002",
    nodeId: "N002",
    currentQuantity: 500,
    reservedQuantity: 0
  },
  {
    productId: "P003",
    nodeId: "N002",
    currentQuantity: 100,
    reservedQuantity: 0
  },
  {
    productId: "P003",
    nodeId: "N001",
    currentQuantity: 100,
    reservedQuantity: 0
  }
];

const forecasts = [
  {
    productId: "P001",
    nodeId: "N001",
    horizonDays: 30,
    expectedDemand: 600,
    averageDailyDemand: 20,
    forecastVersion: "v1",
    updatedAt: new Date()
  },
  {
    productId: "P002",
    nodeId: "N002",
    horizonDays: 30,
    expectedDemand: 600,
    averageDailyDemand: 20,
    forecastVersion: "v1",
    updatedAt: new Date()
  },
  {
    productId: "P003",
    nodeId: "N002",
    horizonDays: 30,
    expectedDemand: 800,
    averageDailyDemand: 26.67,
    forecastVersion: "v1",
    updatedAt: new Date()
  },
  {
    productId: "P003",
    nodeId: "N001",
    horizonDays: 30,
    expectedDemand: 800,
    averageDailyDemand: 26.67,
    forecastVersion: "v1",
    updatedAt: new Date()
  }
];

const purchaseOrders = [
  {
    poNumber: "PO-EXISTING-001",
    productId: "P001",
    nodeId: "N001",
    supplierId: "S001",
    quantity: 100,
    unitPrice: 100,
    totalCost: 10000,
    status: "OPEN",
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    source: "EXISTING"
  },
  {
    poNumber: "PO-EXISTING-002",
    productId: "P001",
    nodeId: "N001",
    supplierId: "S001",
    quantity: 300,
    unitPrice: 100,
    totalCost: 30000,
    status: "OPEN",
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    source: "EXISTING"
  },
  {
    poNumber: "PO-EXISTING-003",
    productId: "P002",
    nodeId: "N002",
    supplierId: "S002",
    quantity: 200,
    unitPrice: 110,
    totalCost: 22000,
    status: "OPEN",
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    source: "EXISTING"
  }
];

const recommendations = [
  {
    recommendationId: "REC-001",
    productId: "P001",
    nodeId: "N001",
    supplierId: "S001",
    recommendedQuantity: 500,
    reason: "Expected demand is higher than current inventory and incoming stock",
    status: "PENDING"
  },
  {
    recommendationId: "REC-002",
    productId: "P001",
    nodeId: "N001",
    supplierId: "S001",
    recommendedQuantity: 800,
    reason: "Demand increased, but existing purchase orders cover part of the requirement",
    status: "PENDING"
  },
  {
    recommendationId: "REC-003",
    productId: "P002",
    nodeId: "N002",
    supplierId: "S002",
    recommendedQuantity: 300,
    reason: "Purchase recommendation generated from demand forecast",
    status: "PENDING"
  },
  {
    recommendationId: "REC-004",
    productId: "P003",
    nodeId: "N002",
    supplierId: "S001",
    recommendedQuantity: 800,
    reason: "Additional inventory is required but budget may be insufficient",
    status: "PENDING"
  },
  {
    recommendationId: "REC-005",
    productId: "P003",
    nodeId: "N001",
    supplierId: "S003",
    recommendedQuantity: 800,
    reason: "Additional inventory is required but storage capacity may be insufficient",
    status: "PENDING"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Node.deleteMany();
    await Supplier.deleteMany();
    await Inventory.deleteMany();
    await Forecast.deleteMany();
    await PurchaseOrder.deleteMany();
    await Recommendation.deleteMany();

    await Product.insertMany(products);
    await Node.insertMany(nodes);
    await Supplier.insertMany(suppliers);
    await Inventory.insertMany(inventory);
    await Forecast.insertMany(forecasts);
    await PurchaseOrder.insertMany(purchaseOrders);
    await Recommendation.insertMany(recommendations);

    console.log("Database seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();