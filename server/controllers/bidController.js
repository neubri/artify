const { Bid, Item, User } = require("../models");

/**
 * Get all bids for a specific item
 * GET /bids/:itemId
 */
const getBidsByItemId = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if item exists
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get bids with pagination
    const { count, rows: bids } = await Bid.findAndCountAll({
      where: { itemId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["amount", "DESC"],
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      message: "Bids retrieved successfully",
      data: {
        item: {
          id: item.id,
          name: item.name,
          startingPrice: item.startingPrice,
        },
        bids,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBids: count,
          bidsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get highest bid for a specific item
 * GET /bids/:itemId/highest
 */
const getHighestBid = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Check if item exists
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Get highest bid
    const highestBid = await Bid.findOne({
      where: { itemId },
      order: [["amount", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    const currentPrice = await item.getCurrentPrice();
    const bidCount = await item.getBidCount();

    res.json({
      success: true,
      message: "Highest bid retrieved successfully",
      data: {
        item: {
          id: item.id,
          name: item.name,
          startingPrice: item.startingPrice,
        },
        currentPrice,
        bidCount,
        highestBid: highestBid
          ? {
              id: highestBid.id,
              amount: highestBid.amount,
              user: highestBid.user,
              createdAt: highestBid.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new bid (REST fallback for Socket.IO)
 * POST /bids
 */
const createBid = async (req, res, next) => {
  try {
    const { itemId, amount } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!itemId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Item ID and amount are required",
      });
    }

    // Check if item exists and is not sold
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.isSold) {
      return res.status(400).json({
        success: false,
        message: "Item is already sold",
      });
    }

    // Check if auction has ended
    if (item.endTime && new Date() > item.endTime) {
      return res.status(400).json({
        success: false,
        message: "Auction has ended",
      });
    }

    // Get current highest bid amount
    const currentPrice = await item.getCurrentPrice();

    if (parseFloat(amount) <= parseFloat(currentPrice)) {
      return res.status(400).json({
        success: false,
        message: `Bid amount must be higher than current price: ${currentPrice}`,
      });
    }

    // Create bid
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
        {
          model: Item,
          as: "item",
          attributes: ["id", "name"],
        },
      ],
    });

    // Get updated item stats
    const newCurrentPrice = await item.getCurrentPrice();
    const newBidCount = await item.getBidCount();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      const bidData = {
        id: bid.id,
        itemId: parseInt(itemId),
        amount: parseFloat(amount),
        user: {
          id: bidWithUser.user.id,
          username: bidWithUser.user.username,
        },
        createdAt: bid.createdAt,
        currentPrice: newCurrentPrice,
        bidCount: newBidCount,
      };

      // Broadcast to all users in the item room
      const roomName = `item-${itemId}`;
      io.to(roomName).emit("new-bid", bidData);
      
      console.log(`Socket broadcast: New bid from ${bidWithUser.user.username} for item ${itemId}`);
    }

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      data: {
        bid: bidWithUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's bid history
 * GET /bids/my-bids
 */
const getUserBids = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get user's bids with pagination
    const { count, rows: bids } = await Bid.findAndCountAll({
      where: { userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["id", "name", "imageUrl", "isSold"],
        },
      ],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      message: "User bids retrieved successfully",
      data: {
        bids,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBids: count,
          bidsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBidsByItemId,
  getHighestBid,
  createBid,
  getUserBids,
};
