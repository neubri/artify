const { Bid, Item, User } = require("../models");

/**
 * Bidding Socket Handlers
 * Handles real-time bidding events
 */
const handleBidding = (io, socket) => {
  console.log(`User ${socket.user.username} connected to bidding socket`);

  /**
   * Join item room for real-time updates
   * Event: 'join-item'
   * Data: { itemId }
   */
  socket.on("join-item", async (data) => {
    try {
      const { itemId } = data;

      if (!itemId) {
        socket.emit("error", { message: "Item ID is required" });
        return;
      }

      // Check if item exists
      const item = await Item.findByPk(itemId);
      if (!item) {
        socket.emit("error", { message: "Item not found" });
        return;
      }

      // Join the item-specific room
      const roomName = `item-${itemId}`;
      socket.join(roomName);

      console.log(`User ${socket.user.username} joined room: ${roomName}`);

      // Send current item status to the user
      const currentPrice = await item.getCurrentPrice();
      const bidCount = await item.getBidCount();

      // Get highest bidder info
      const highestBid = await Bid.findOne({
        where: { itemId },
        order: [["amount", "DESC"]],
        include: [{ model: User, as: "user", attributes: ["id", "username"] }],
      });

      socket.emit("item-status", {
        itemId,
        currentPrice,
        bidCount,
        highestBidder: highestBid ? highestBid.user : null,
        isSold: item.isSold,
        endTime: item.endTime,
      });

      // Notify room about new participant
      socket.to(roomName).emit("user-joined", {
        user: {
          id: socket.user.id,
          username: socket.user.username,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Join item error:", error);
      socket.emit("error", { message: "Failed to join item room" });
    }
  });

  /**
   * Leave item room
   * Event: 'leave-item'
   * Data: { itemId }
   */
  socket.on("leave-item", (data) => {
    try {
      const { itemId } = data;
      const roomName = `item-${itemId}`;

      socket.leave(roomName);
      console.log(`User ${socket.user.username} left room: ${roomName}`);

      // Notify room about user leaving
      socket.to(roomName).emit("user-left", {
        user: {
          id: socket.user.id,
          username: socket.user.username,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Leave item error:", error);
    }
  });

  /**
   * Place a bid
   * Event: 'place-bid'
   * Data: { itemId, amount }
   */
  socket.on("place-bid", async (data) => {
    try {
      const { itemId, amount } = data;
      const userId = socket.user.id;

      // Validate input
      if (!itemId || !amount) {
        socket.emit("bid-error", {
          message: "Item ID and amount are required",
        });
        return;
      }

      // Check if item exists and is available for bidding
      const item = await Item.findByPk(itemId);
      if (!item) {
        socket.emit("bid-error", {
          message: "Item not found",
        });
        return;
      }

      if (item.isSold) {
        socket.emit("bid-error", {
          message: "Item is already sold",
        });
        return;
      }

      // Check if auction has ended
      if (item.endTime && new Date() > item.endTime) {
        socket.emit("bid-error", {
          message: "Auction has ended",
        });
        return;
      }

      // Validate bid amount
      const currentPrice = await item.getCurrentPrice();
      if (parseFloat(amount) <= parseFloat(currentPrice)) {
        socket.emit("bid-error", {
          message: `Bid amount must be higher than current price: ${currentPrice}`,
        });
        return;
      }

      // Create the bid
      const bid = await Bid.create({
        itemId,
        userId,
        amount,
      });

      // Fetch the created bid with user info
      const bidWithUser = await Bid.findByPk(bid.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username"],
          },
        ],
      });

      // Update item status
      const newCurrentPrice = await item.getCurrentPrice();
      const newBidCount = await item.getBidCount();

      // Prepare bid data for broadcast
      const bidData = {
        id: bid.id,
        itemId,
        amount: parseFloat(amount),
        user: {
          id: socket.user.id,
          username: socket.user.username,
        },
        createdAt: bid.createdAt,
        currentPrice: newCurrentPrice,
        bidCount: newBidCount,
      };

      // Broadcast to all users in the item room
      const roomName = `item-${itemId}`;
      io.to(roomName).emit("new-bid", bidData);

      // Send success confirmation to bidder
      socket.emit("bid-success", {
        message: "Bid placed successfully",
        bid: bidData,
      });

      console.log(
        `New bid: ${socket.user.username} bid ${amount} on item ${itemId}`
      );
    } catch (error) {
      console.error("Place bid error:", error);
      socket.emit("bid-error", {
        message: "Failed to place bid. Please try again.",
      });
    }
  });

  /**
   * Get real-time bid history for an item
   * Event: 'get-bid-history'
   * Data: { itemId, limit }
   */
  socket.on("get-bid-history", async (data) => {
    try {
      const { itemId, limit = 10 } = data;

      if (!itemId) {
        socket.emit("error", { message: "Item ID is required" });
        return;
      }

      // Get recent bids
      const bids = await Bid.findAll({
        where: { itemId },
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username"],
          },
        ],
      });

      socket.emit("bid-history", {
        itemId,
        bids: bids.map((bid) => ({
          id: bid.id,
          amount: bid.amount,
          user: bid.user,
          createdAt: bid.createdAt,
        })),
      });
    } catch (error) {
      console.error("Get bid history error:", error);
      socket.emit("error", { message: "Failed to get bid history" });
    }
  });

  /**
   * Handle socket disconnection
   */
  socket.on("disconnect", () => {
    console.log(
      `User ${socket.user.username} disconnected from bidding socket`
    );
  });
};

module.exports = {
  handleBidding,
};
