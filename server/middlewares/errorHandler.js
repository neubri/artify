/**
 * Global error handling middleware
 * Handles various types of errors and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error stack:", err.stack);

  // Sequelize Validation Error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    const value = err.errors[0].value;

    return res.status(400).json({
      success: false,
      message: `${field} '${value}' already exists`,
    });
  }

  // Sequelize Database Error
  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      success: false,
      message: "Database operation failed",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Invalid data",
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Custom Application Errors
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Default Internal Server Error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
