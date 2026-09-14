function AgentResult({ result }) {
  if (!result) {
    return null;
  }

  const action = result.action || {};

  return (
    <div className="agent-result">
      <h3>Latest Agent Review</h3>

      <p>
        <strong>Decision:</strong>{" "}
        <span className={`decision ${result.decision}`}>
          {result.decision}
        </span>
      </p>

      <p>
        <strong>Recommended Quantity:</strong>{" "}
        {result.recommendedQuantity ?? "N/A"}
      </p>

      <p>
        <strong>Supplier:</strong>{" "}
        {result.supplierId ?? "N/A"}
      </p>

      <p>
        <strong>Unit Price:</strong>{" "}
        {result.unitPrice !== undefined
          ? `₹${result.unitPrice}`
          : "N/A"}
      </p>

      <p>
        <strong>Reasoning:</strong>{" "}
        {result.reasoning || "No reasoning provided"}
      </p>

      <p>
        <strong>Action:</strong>{" "}
        {action.type || "NONE"}
      </p>

      {result.validation && (
        <div className="validation-box">
          <strong>Validation:</strong>{" "}
          {result.validation.valid ? "Passed" : "Failed"}

          {result.validation.errors?.length > 0 && (
            <ul>
              {result.validation.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          {result.validation.warnings?.length > 0 && (
            <ul>
              {result.validation.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentResult;