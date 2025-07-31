const express = require("express");
const router = express.Router();
const {
  getBidsByItemId,
  getHighestBid,
  createBid,
  getUserBids,
} = require("../controllers/bidController");
const { authenticateToken } = require("../middlewares/auth");

/**
 * Bids Routes
 * All bidding related endpoints (REST fallback for Socket.IO)
 */

// Get all bids for a specific item
// GET /bids/:itemId
router.get("/:itemId", getBidsByItemId);

// Get highest bid for a specific item
// GET /bids/:itemId/highest
router.get("/:itemId/highest", getHighestBid);

// Create new bid (protected route - REST fallback)
// POST /bids
router.post("/", authenticateToken, createBid);

// Get current user's bid history (protected route)
// GET /bids/my-bids
router.get("/user/my-bids", authenticateToken, getUserBids);

module.exports = router;
