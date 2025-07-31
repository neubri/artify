require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");
const routes = require("./routes");

/**
 * Create Express Application
 * Configures middleware and routes for the Artify API
 */
const createApp = () => {
  const app = express();

  // Basic middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // CORS configuration
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URL
          : [
              "http://localhost:3000",
              "http://localhost:3001",
              "http://localhost:5173",
              "http://localhost:5174",
            ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    })
  );

  // Security headers
  app.use((req, res, next) => {
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    next();
  });

  // Request logging middleware (development only)
  if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  // API routes
  app.use("/api", routes);

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Artify API Server",
      description: "Real-time auction platform for collectibles",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      endpoints: {
        api: "/api",
        health: "/api/health",
        auth: "/api/auth",
        items: "/api/items",
        bids: "/api/bids",
        ai: "/api/ai",
      },
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
