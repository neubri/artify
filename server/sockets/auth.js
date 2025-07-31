const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Socket.IO Authentication Middleware
 * Verifies JWT token from socket handshake
 */
const socketAuth = async (socket, next) => {
  try {
    // Get token from socket handshake auth
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return next(new Error("User not found"));
    }

    // Add user to socket object
    socket.user = user;
    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Authentication failed"));
  }
};

module.exports = {
  socketAuth,
};
