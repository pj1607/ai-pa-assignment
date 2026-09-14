import express from "express";

import {
  getAllActionLogs,
  getActionLogById,
  getPendingActions
} from "../controllers/actionLogController.js";

const router = express.Router();

router.get("/", getAllActionLogs);
router.get("/pending", getPendingActions);
router.get("/:actionId", getActionLogById);

export default router;