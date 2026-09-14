import { useEffect, useState } from "react";

import RecommendationCard from "./components/RecommendationCard";
import ActionCard from "./components/ActionCard";
import PurchaseOrderTable from "./components/PurchaseOrderTable";
import AgentResult from "./components/AgentResult";

import {
  getRecommendations,
  reviewRecommendation,
  getActionLogs,
  approveAction,
  rejectAction,
  executeAction,
  getPurchaseOrders,
} from "./services/api";

import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import RecommendOutlinedIcon from "@mui/icons-material/RecommendOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import "./App.css";

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [agentResult, setAgentResult] = useState(null);

  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    try {
      const [
        recommendationsResponse,
        actionsResponse,
        purchaseOrdersResponse,
      ] = await Promise.all([
        getRecommendations(),
        getActionLogs(),
        getPurchaseOrders(),
      ]);

      setRecommendations(recommendationsResponse.data);

      const actionableActions = actionsResponse.data.filter(
        (action) =>
          action.status === "PROPOSED" ||
          action.status === "APPROVED"
      );

      setPendingActions(actionableActions);
      setPurchaseOrders(purchaseOrdersResponse.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleReview = async (recommendationId) => {
    try {
      setLoadingId(recommendationId);
      setMessage("");

      const response = await reviewRecommendation(
        recommendationId
      );

      setAgentResult(response.data);

      setMessage(
        `Agent decision: ${response.data.decision}`
      );

      await loadDashboard();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Agent review failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleApprove = async (actionId) => {
    try {
      setLoadingId(actionId);
      setMessage("");

      await approveAction(actionId, "HUMAN_USER");

      setMessage("Action approved successfully");

      await loadDashboard();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to approve action"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (actionId) => {
    try {
      setLoadingId(actionId);
      setMessage("");

      await rejectAction(actionId);

      setMessage("Action rejected successfully");

      await loadDashboard();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to reject action"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleExecute = async (actionId) => {
    try {
      setLoadingId(actionId);
      setMessage("");

      const response = await executeAction(actionId);

      const purchaseOrder =
        response.purchaseOrder ||
        response.data?.purchaseOrder;

      if (purchaseOrder?.poNumber) {
        setMessage(
          `PO created: ${purchaseOrder.poNumber}`
        );
      } else {
        setMessage("Purchase order created successfully");
      }

      await loadDashboard();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to execute action"
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        pb: 6,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)",
        }}
      >
        <Toolbar>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: { xs: 0, sm: 2 },
            }}
          >
            <AutoAwesomeOutlinedIcon />

            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                lineHeight={1.2}
              >
                AI Purchasing Agent
              </Typography>

              <Typography
                variant="caption"
                sx={{ opacity: 0.85 }}
              >
                Intelligent purchasing and approval dashboard
              </Typography>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Stack spacing={4}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(135deg, #ffffff 0%, #f1f6ff 100%)",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              color="text.primary"
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  sm: "2.2rem",
                },
              }}
            >
              Purchasing Operations Dashboard
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 760 }}
            >
              Review AI-generated recommendations, approve
              proposed actions, execute purchase orders, and
              monitor purchasing activity from one place.
            </Typography>
          </Paper>

          {message && (
            <Alert
              severity={
                message.toLowerCase().includes("failed")
                  ? "error"
                  : "success"
              }
              onClose={() => setMessage("")}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {message}
            </Alert>
          )}

          {agentResult && (
            <Box>
              <AgentResult result={agentResult} />
            </Box>
          )}

          <Box component="section">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <RecommendOutlinedIcon color="primary" />

                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Purchasing Recommendations
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    AI-generated suggestions requiring review
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<RefreshOutlinedIcon />}
                onClick={loadDashboard}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Refresh
              </Button>
            </Stack>

            {recommendations.length === 0 ? (
              <EmptySectionMessage>
                No recommendations available.
              </EmptySectionMessage>
            ) : (
              <Grid container spacing={3}>
                {recommendations.map((recommendation) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={recommendation.recommendationId}
                  >
                    <RecommendationCard
                      recommendation={recommendation}
                      onReview={handleReview}
                      loading={
                        loadingId ===
                        recommendation.recommendationId
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Divider />

          <Box component="section">
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ mb: 2.5 }}
            >
              <GavelOutlinedIcon color="primary" />

              <Box>
                <Typography variant="h5" fontWeight={800}>
                  Human Approval and Execution Actions
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Review and execute approved purchasing actions
                </Typography>
              </Box>
            </Stack>

            {pendingActions.length === 0 ? (
              <EmptySectionMessage>
                No active actions.
              </EmptySectionMessage>
            ) : (
              <Grid container spacing={3}>
                {pendingActions.map((action) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={action.actionId}
                  >
                    <ActionCard
                      action={action}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onExecute={handleExecute}
                      loading={loadingId === action.actionId}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Divider />

          <Box component="section">
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ mb: 2.5 }}
            >
              <ReceiptLongOutlinedIcon color="primary" />

              <Box>
                <Typography variant="h5" fontWeight={800}>
                  Purchase Orders
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  View created purchase orders and their status
                </Typography>
              </Box>
            </Stack>

            <PurchaseOrderTable
              purchaseOrders={purchaseOrders}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function EmptySectionMessage({ children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Typography color="text.secondary">
        {children}
      </Typography>
    </Paper>
  );
}

export default App;