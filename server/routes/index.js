const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");
const itemRoutes = require("./items");
const bidRoutes = require("./bids");
const aiRoutes = require("./ai");

/**
 * Main Router - Combines all route modules
 * Provides a centralized place to organize all API routes
 */

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Artify API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Artify API",
    description: "Real-time auction platform for collectibles",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items",
      bids: "/api/bids",
      ai: "/api/ai",
    },
    documentation: "/api/docs",
  });
});

// Route modules
router.use("/auth", authRoutes);
router.use("/items", itemRoutes);
router.use("/bids", bidRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
