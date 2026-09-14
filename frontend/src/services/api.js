import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getRecommendations = async () => {
  const response = await api.get("/recommendations");
  return response.data;
};

export const reviewRecommendation = async (recommendationId) => {
  const response = await api.post("/agent/review", {
    recommendationId
  });

  return response.data;
};

export const getPendingActions = async () => {
  const response = await api.get("/action-logs/pending");
  return response.data;
};
export const getActionLogs = async () => {
  const response = await api.get("/action-logs");
  return response.data;
};
export const approveAction = async (actionId, approvedBy = "HUMAN_USER") => {
  const response = await api.post(
    `/approvals/${actionId}/approve`,
    {
      approvedBy
    }
  );

  return response.data;
};

export const rejectAction = async (actionId) => {
  const response = await api.post(
    `/approvals/${actionId}/reject`
  );

  return response.data;
};

export const executeAction = async (actionId) => {
  const response = await api.post(
    `/approvals/${actionId}/execute`
  );

  return response.data;
};

export const getPurchaseOrders = async () => {
  const response = await api.get("/purchase-orders");
  return response.data;
};

export default api;