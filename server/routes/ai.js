const express = require("express");
const router = express.Router();
const {
  getWhyWorthIt,
  getPricePrediction,
  getBiddingStrategy,
} = require("../controllers/aiController");
const { authenticateToken } = require("../middlewares/auth");

/**
 * AI Assistant Routes
 * AI-powered analysis and recommendations for auction items
 */

// Get AI analysis of why an item is worth bidding on
// POST /ai/why-worth-it
router.post("/why-worth-it", getWhyWorthIt);

// Get AI price prediction for an item
// POST /ai/price-prediction
router.post("/price-prediction", getPricePrediction);

// Get AI bidding strategy recommendations
// POST /ai/bidding-strategy
router.post("/bidding-strategy", getBiddingStrategy);

module.exports = router;
