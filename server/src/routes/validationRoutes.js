import express from "express";
import { validateProposal } from "../controllers/validationController.js";

const router = express.Router();

router.post("/purchase-order", validateProposal);

export default router;