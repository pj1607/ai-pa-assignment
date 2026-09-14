function RecommendationCard({
  recommendation,
  onReview,
  loading
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{recommendation.recommendationId}</h3>
        <span className="badge">
          {recommendation.status}
        </span>
      </div>

      <p>
        <strong>Product:</strong> {recommendation.productId}
      </p>

      <p>
        <strong>Node:</strong> {recommendation.nodeId}
      </p>

      <p>
        <strong>Supplier:</strong> {recommendation.supplierId}
      </p>

      <p>
        <strong>Recommended Quantity:</strong>{" "}
        {recommendation.recommendedQuantity}
      </p>

      <p>
        <strong>Reason:</strong> {recommendation.reason}
      </p>

      <button
        onClick={() => onReview(recommendation.recommendationId)}
        disabled={loading}
      >
        {loading ? "Reviewing..." : "Review with AI"}
      </button>
    </div>
  );
}

export default RecommendationCard;