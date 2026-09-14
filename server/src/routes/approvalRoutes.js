import express from "express";

import {
  approveAction,
  rejectAction
} from "../controllers/approvalController.js";

import {
  executeApprovedAction
} from "../controllers/actionExecutionController.js";

const router = express.Router();

router.post("/:actionId/approve", approveAction);
router.post("/:actionId/reject", rejectAction);
router.post("/:actionId/execute", executeApprovedAction);

export default router;