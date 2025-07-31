const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { authenticateToken, optionalAuth } = require("../middlewares/auth");

/**
 * Items Routes
 * All collectible items related endpoints
 */

// Get all items (with optional filtering and pagination)
// GET /items?page=1&limit=10&search=camera&sold=false
router.get("/", optionalAuth, getAllItems);

// Get single item by ID
// GET /items/:id
router.get("/:id", optionalAuth, getItemById);

// Create new item (protected route - for testing)
// POST /items
router.post("/", authenticateToken, createItem);

// Update item (protected route)
// PUT /items/:id
router.put("/:id", authenticateToken, updateItem);

// Delete item (protected route)
// DELETE /items/:id
router.delete("/:id", authenticateToken, deleteItem);

module.exports = router;
