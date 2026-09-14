import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import validationRoutes from "./routes/validationRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import agentRunRoutes from "./routes/agentRunRoutes.js";
import actionLogRoutes from "./routes/actionLogRoutes.js";
import approvalRoutes from "./routes/approvalRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Health-check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Purchasing Agent API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "purchasing-agent-backend",
    status: "healthy"
  });
});

// Recommendation routes
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/validate", validationRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/agent-runs", agentRunRoutes);
app.use("/api/action-logs", actionLogRoutes);
app.use("/api/approvals", approvalRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
