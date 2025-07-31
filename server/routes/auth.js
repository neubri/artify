const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/auth");

/**
 * Auth Routes
 * All authentication related endpoints
 */

// Register new user
// POST /auth/register
router.post("/register", register);

// Login user
// POST /auth/login
router.post("/login", login);

// Get current user profile (protected route)
// GET /auth/profile
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
