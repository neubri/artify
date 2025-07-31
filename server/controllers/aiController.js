const { Item, Bid, User } = require("../models");
const geminiService = require("../services/geminiService");

/**
 * AI Assistant Controller
 * Provides AI-powered insights about auction items using Google Gemini 2.5 Flash
 */

/**
 * Get AI analysis of why an item is worth bidding on
 * POST /ai/why-worth-it
 */
const getWhyWorthIt = async (req, res, next) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Get item details from database
    const item = await Item.findByPk(itemId, {
      include: [
        {
          model: Bid,
          as: "bids",
          order: [["amount", "DESC"]],
          limit: 1,
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

    // Prepare item data for AI analysis
    const currentPrice = await item.getCurrentPrice();
    const bidCount = await item.getBidCount();

    const itemData = {
      name: item.name,
      description: item.description,
      startingPrice: item.startingPrice,
      currentPrice,
      bidCount,
      isSold: item.isSold,
      endTime: item.endTime,
      createdAt: item.createdAt,
    };

    // Generate AI analysis using Gemini
    const aiResult = await geminiService.generateWhyWorthIt(itemData);

    res.json({
      success: true,
      message: "AI analysis completed",
      data: {
        itemId: parseInt(itemId),
        analysis: aiResult.analysis,
        confidence: aiResult.confidence,
        factors: aiResult.factors,
        methodology: aiResult.methodology,
        generatedAt: new Date().toISOString(),
        poweredBy: "Google Gemini 2.5 Flash",
      },
    });
  } catch (error) {
    console.error("AI Why Worth It error:", error);
    next(error);
  }
};

/**
 * Get AI price prediction for an item
 * POST /ai/price-prediction
 */
const getPricePrediction = async (req, res, next) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Get item details from database
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Prepare item data for AI analysis
    const currentPrice = await item.getCurrentPrice();
    const bidCount = await item.getBidCount();

    const itemData = {
      name: item.name,
      description: item.description,
      startingPrice: item.startingPrice,
      currentPrice,
      bidCount,
      isSold: item.isSold,
      endTime: item.endTime,
      createdAt: item.createdAt,
    };

    // Generate AI price prediction using Gemini
    const aiResult = await geminiService.generatePricePrediction(itemData);

    res.json({
      success: true,
      message: "Price prediction completed",
      data: {
        itemId: parseInt(itemId),
        predictions: {
          nextHour: aiResult.predictions.nextHour,
          next24Hours: aiResult.predictions.next24Hours,
          estimatedFinalPrice: aiResult.predictions.estimatedFinalPrice,
        },
        analysis: aiResult.analysis,
        confidence: aiResult.confidence,
        factors: aiResult.factors,
        methodology: aiResult.methodology,
        disclaimer:
          "This is an AI prediction and should not be considered as financial advice.",
        generatedAt: new Date().toISOString(),
        poweredBy: "Google Gemini 2.5 Flash",
      },
    });
  } catch (error) {
    console.error("AI Price Prediction error:", error);
    next(error);
  }
};

/**
 * Get AI bidding strategy recommendation
 * POST /ai/bidding-strategy
 */
const getBiddingStrategy = async (req, res, next) => {
  try {
    const { itemId, userBudget, bidHistory } = req.body;

    if (!itemId || !userBudget) {
      return res.status(400).json({
        success: false,
        message: "Item ID and budget are required",
      });
    }

    // Get item details from database
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Prepare data for AI analysis
    const currentPrice = await item.getCurrentPrice();
    const bidCount = await item.getBidCount();

    const itemData = {
      name: item.name,
      description: item.description,
      startingPrice: item.startingPrice,
      currentPrice,
      bidCount,
      isSold: item.isSold,
      endTime: item.endTime,
      createdAt: item.createdAt,
    };

    const strategyData = {
      userBudget: parseInt(userBudget),
      bidHistory: bidHistory || [],
      itemData,
    };

    // Generate AI bidding strategy using Gemini
    console.log(
      "Calling generateBiddingStrategy with:",
      itemData,
      parseInt(userBudget)
    );
    const aiResult = await geminiService.generateBiddingStrategy(
      itemData,
      parseInt(userBudget)
    );
    console.log("AI Result received:", aiResult);

    res.json({
      success: true,
      message: "Bidding strategy generated",
      data: {
        itemId: parseInt(itemId),
        strategy: aiResult.recommendedStrategy,
        analysis: aiResult.analysis,
        budgetAnalysis: aiResult.budgetAnalysis,
        tips: aiResult.tips,
        methodology: aiResult.methodology,
        disclaimer:
          "This is an AI-generated strategy and should be used as guidance only.",
        generatedAt: new Date().toISOString(),
        poweredBy: "Google Gemini 1.5 Flash",
      },
    });
  } catch (error) {
    console.error("AI Bidding Strategy error:", error);
    next(error);
  }
};

module.exports = {
  getWhyWorthIt,
  getPricePrediction,
  getBiddingStrategy,
};
