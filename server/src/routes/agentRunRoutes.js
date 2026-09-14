import express from "express";

import {
  getAllAgentRuns,
  getAgentRunById
} from "../controllers/agentRunController.js";

const router = express.Router();

router.get("/", getAllAgentRuns);
router.get("/:runId", getAgentRunById);

export default router;