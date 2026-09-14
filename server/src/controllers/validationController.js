import { validatePurchaseOrderProposal } from "../services/validationService.js";

export const validateProposal = async (req, res) => {
  try {
    const {
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice
    } = req.body;

    const result = await validatePurchaseOrderProposal({
      productId,
      nodeId,
      supplierId,
      quantity,
      unitPrice
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Validation failed",
      error: error.message
    });
  }
};