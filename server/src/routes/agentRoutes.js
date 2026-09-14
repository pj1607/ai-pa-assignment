import express from "express";
import { reviewRecommendation } from "../controllers/agentController.js";

const router = express.Router();

router.post("/review", reviewRecommendation);

export default router;