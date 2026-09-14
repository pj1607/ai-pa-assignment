import express from "express";

import {
  getAllRecommendations,
  getRecommendationById
} from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/", getAllRecommendations);
router.get("/:recommendationId", getRecommendationById);

export default router;