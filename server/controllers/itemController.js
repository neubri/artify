const { Item, Bid, User } = require("../models");
const { Op } = require("sequelize");

/**
 * Get all items with pagination and filtering
 * GET /items?page=1&limit=10&search=camera&sold=false
 */
const getAllItems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sold,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    // Build where conditions
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (sold !== undefined) {
      whereConditions.isSold = sold === "true";
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Find items with pagination
    const { count, rows: items } = await Item.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: Bid,
          as: "bids",
          limit: 1,
          order: [["amount", "DESC"]],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    // Add current price and bid count to each item
    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        const currentPrice = await item.getCurrentPrice();
        const bidCount = await item.getBidCount();

        return {
          ...item.toJSON(),
          currentPrice,
          bidCount,
          highestBidder: item.bids.length > 0 ? item.bids[0].user : null,
        };
      })
    );

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      message: "Items retrieved successfully",
      data: {
        items: itemsWithDetails,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
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
 * Get single item by ID with bids history
 * GET /items/:id
 */
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [
        {
          model: Bid,
          as: "bids",
          order: [["amount", "DESC"]], // Get bids sorted by amount descending
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const currentPrice = await item.getCurrentPrice();
    const bidCount = await item.getBidCount();

    res.json({
      success: true,
      message: "Item retrieved successfully",
      data: {
        item: {
          ...item.toJSON(),
          currentPrice,
          bidCount,
          highestBidder: item.bids.length > 0 ? item.bids[0].user : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new item (for testing purposes)
 * POST /items
 */
const createItem = async (req, res, next) => {
  try {
    const { name, description, startingPrice, imageUrl, endTime } = req.body;

    // Validate required fields
    if (!name || !startingPrice) {
      return res.status(400).json({
        success: false,
        message: "Name and starting price are required",
      });
    }

    const item = await Item.create({
      name,
      description,
      startingPrice,
      imageUrl,
      endTime: endTime ? new Date(endTime) : null,
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update item (mark as sold, etc.)
 * PUT /items/:id
 */
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isSold, endTime } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Update only allowed fields
    const updateData = {};
    if (isSold !== undefined) updateData.isSold = isSold;
    if (endTime !== undefined)
      updateData.endTime = endTime ? new Date(endTime) : null;

    await item.update(updateData);

    res.json({
      success: true,
      message: "Item updated successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete item
 * DELETE /items/:id
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
