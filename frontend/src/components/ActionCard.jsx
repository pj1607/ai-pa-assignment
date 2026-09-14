function ActionCard({
  action,
  onApprove,
  onReject,
  onExecute,
  loading
}) {
  const proposedAction = action.proposedAction || {};

  return (
    <div className="card">
      <div className="card-header">
        <h3>{action.actionId}</h3>
        <span className="badge">
          {action.approvalStatus}
        </span>
      </div>

      <p>
        <strong>Recommendation:</strong>{" "}
        {action.recommendationId || "N/A"}
      </p>

      <p>
        <strong>Action:</strong> {action.actionType}
      </p>

      <p>
        <strong>Product:</strong> {proposedAction.productId}
      </p>

      <p>
        <strong>Node:</strong> {proposedAction.nodeId}
      </p>

      <p>
        <strong>Supplier:</strong> {proposedAction.supplierId}
      </p>

      <p>
        <strong>Quantity:</strong> {proposedAction.quantity}
      </p>

      <p>
        <strong>Unit Price:</strong> ₹{proposedAction.unitPrice}
      </p>

      {action.approvalStatus === "PENDING" && (
        <div className="button-row">
          <button
            onClick={() => onApprove(action.actionId)}
            disabled={loading}
          >
            Approve
          </button>

          <button
            className="danger-button"
            onClick={() => onReject(action.actionId)}
            disabled={loading}
          >
            Reject
          </button>
        </div>
      )}

      {action.approvalStatus === "APPROVED" &&
        action.status !== "COMPLETED" && (
          <button
            onClick={() => onExecute(action.actionId)}
            disabled={loading}
          >
            Execute PO
          </button>
        )}
    </div>
  );
}

export default ActionCard;