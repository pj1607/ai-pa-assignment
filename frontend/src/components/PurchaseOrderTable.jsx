function PurchaseOrderTable({ purchaseOrders }) {
  if (!purchaseOrders.length) {
    return <p>No purchase orders created yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Product</th>
            <th>Node</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {purchaseOrders.map((purchaseOrder) => (
            <tr key={purchaseOrder.poNumber}>
              <td>{purchaseOrder.poNumber}</td>
              <td>{purchaseOrder.productId}</td>
              <td>{purchaseOrder.nodeId}</td>
              <td>{purchaseOrder.supplierId}</td>
              <td>{purchaseOrder.quantity}</td>
              <td>₹{purchaseOrder.totalCost}</td>
              <td>{purchaseOrder.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseOrderTable;