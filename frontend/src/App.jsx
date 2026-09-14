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
  getPurchaseOrders
} from "./services/api";

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
        purchaseOrdersResponse
      ] = await Promise.all([
        getRecommendations(),
        getActionLogs(),
        getPurchaseOrders()
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
    <div className="app">
      <header className="app-header">
        <h1>AI Purchasing Agent</h1>

        <p>
          Constraint-aware recommendation review and
          purchase-order execution
        </p>
      </header>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <AgentResult result={agentResult} />

      <section>
        <div className="section-header">
          <h2>Purchasing Recommendations</h2>

          <button onClick={loadDashboard}>
            Refresh
          </button>
        </div>

        <div className="card-grid">
          {recommendations.length === 0 ? (
            <p>No recommendations available.</p>
          ) : (
            recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.recommendationId}
                recommendation={recommendation}
                onReview={handleReview}
                loading={
                  loadingId ===
                  recommendation.recommendationId
                }
              />
            ))
          )}
        </div>
      </section>

      <section>
        <h2>Human Approval and Execution Actions</h2>

        {pendingActions.length === 0 ? (
          <p>No active actions.</p>
        ) : (
          <div className="card-grid">
            {pendingActions.map((action) => (
              <ActionCard
                key={action.actionId}
                action={action}
                onApprove={handleApprove}
                onReject={handleReject}
                onExecute={handleExecute}
                loading={loadingId === action.actionId}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Purchase Orders</h2>

        <PurchaseOrderTable
          purchaseOrders={purchaseOrders}
        />
      </section>
    </div>
  );
}

export default App;