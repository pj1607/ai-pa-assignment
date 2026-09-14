import Recommendation from "../models/Recommendation.js";

export const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
      error: error.message
    });
  }
};

export const getRecommendationById = async (req, res) => {
  try {
    const { recommendationId } = req.params;

    const recommendation = await Recommendation.findOne({
      recommendationId
    }).lean();

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found"
      });
    }

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendation",
      error: error.message
    });
  }
};