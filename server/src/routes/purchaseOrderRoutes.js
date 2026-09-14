import express from "express";

import {
  validatePurchaseOrder,
  createApprovedPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrder
} from "../controllers/purchaseOrderController.js";

const router = express.Router();

router.post("/validate", validatePurchaseOrder);

router.post("/", createApprovedPurchaseOrder);

router.get("/", getAllPurchaseOrders);

router.get("/:poNumber", getPurchaseOrder);

export default router;