import { io } from "socket.io-client";
import authService from "./authService";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  // Connect to socket with authentication
  connect() {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    const token = authService.getToken();

    // Only connect if we have a token
    if (!token) {
      console.log("No auth token available, skipping socket connection");
      return;
    }

    console.log("Connecting to socket server at:", SOCKET_URL);
    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.connected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🚨 Socket connection error:", error);
      this.connected = false;
    });

    // Debug all socket events
    this.socket.onAny((event, ...args) => {
      console.log(`🔔 Socket event received: ${event}`, args);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join item auction room
  joinItem(itemId) {
    if (this.socket && this.connected) {
      this.socket.emit("join-item", { itemId });
    }
  }

  // Leave item auction room
  leaveItem(itemId) {
    if (this.socket && this.connected) {
      this.socket.emit("leave-item", { itemId });
    }
  }

  // Place a bid via socket
  placeBid(bidData) {
    if (this.socket && this.connected) {
      this.socket.emit("place-bid", bidData);
    }
  }

  // Listen for new bids
  onNewBid(callback) {
    if (this.socket) {
      this.socket.on("new-bid", callback);
    }
  }

  // Listen for bid errors
  onBidError(callback) {
    if (this.socket) {
      this.socket.on("bid-error", callback);
    }
  }

  // Listen for auction updates
  onAuctionUpdate(callback) {
    if (this.socket) {
      this.socket.on("auction-update", callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Remove specific listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Check if connected
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
