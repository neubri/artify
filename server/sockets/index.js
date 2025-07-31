const { Server } = require("socket.io");
const { socketAuth } = require("./auth");
const { handleBidding } = require("./bidding");

/**
 * Initialize Socket.IO server with authentication and event handlers
 */
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://news.neubri.site/api/",
        "https://news.neubri.site/api",
        "https://artify-4.web.app/",
        "https://artify-4.firebaseapp.com/",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Apply authentication middleware
  io.use(socketAuth);

  // Handle connections
  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id} (User: ${socket.user.username})`
    );

    // Initialize bidding handlers
    handleBidding(io, socket);

    // Global disconnect handler
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (Reason: ${reason})`);
    });

    // Global error handler
    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
      socket.emit("error", {
        message: "An error occurred. Please try again.",
        timestamp: new Date().toISOString(),
      });
    });
  });

  // Global error handler for Socket.IO server
  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO connection error:", err);
  });

  console.log("✅ Socket.IO server initialized");
  return io;
};

module.exports = {
  initSocket,
};
