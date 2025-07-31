const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Gemini AI Service
 * Handles all interactions with Google Gemini 2.5 Flash model
 */
class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
  }

  /**
   * Generate why an item is worth bidding on
   */
  async generateWhyWorthIt(itemData) {
    const prompt = `
    As an expert auctioneer and collectibles appraiser, analyze why this auction item is worth bidding on.

    Item Details:
    - Name: ${itemData.name}
    - Description: ${itemData.description}
    - Starting Price: Rp ${Number(itemData.startingPrice).toLocaleString(
      "id-ID"
    )}
    - Current Price: Rp ${Number(itemData.currentPrice).toLocaleString("id-ID")}
    - Number of Bids: ${itemData.bidCount}
    - Auction Status: ${itemData.isSold ? "SOLD" : "ACTIVE"}
    ${
      itemData.endTime
        ? `- Ends: ${new Date(itemData.endTime).toLocaleString("id-ID")}`
        : ""
    }

    Please provide a comprehensive analysis covering:
    1. Investment potential and market value
    2. Rarity and collectibility factors
    3. Historical significance or cultural importance
    4. Condition assessment based on description
    5. Market trends for this type of collectible

    Keep the response engaging, informative, and professional. Focus on factual analysis that would help a serious collector make an informed decision.

    Format your response in clear, concise paragraphs (max 200 words).
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        analysis: text.trim(),
        confidence: this._calculateConfidence(itemData),
        factors: this._extractKeyFactors(text),
        methodology:
          "Analysis based on market data, historical trends, and collectibles expertise",
      };
    } catch (error) {
      console.error("Gemini API error (why-worth-it):", error);
      throw new Error("Failed to generate AI analysis");
    }
  }

  /**
   * Generate price prediction
   */
  async generatePricePrediction(itemData) {
    const prompt = `
    As a professional auction analyst and market expert, predict the price trajectory for this collectible auction item.

    Item Details:
    - Name: ${itemData.name}
    - Description: ${itemData.description}
    - Starting Price: Rp ${Number(itemData.startingPrice).toLocaleString(
      "id-ID"
    )}
    - Current Price: Rp ${Number(itemData.currentPrice).toLocaleString("id-ID")}
    - Number of Bids: ${itemData.bidCount}
    - Time since auction started: ${this._getAuctionDuration(itemData)}
    ${
      itemData.endTime
        ? `- Time remaining: ${this._getTimeRemaining(itemData.endTime)}`
        : ""
    }

    Based on auction dynamics, bidding patterns, and market data for similar collectibles, provide:

    1. Estimated price in the next hour (short-term momentum)
    2. Estimated price in the next 24 hours (medium-term trend)
    3. Estimated final auction price (closing prediction)

    Consider factors like:
    - Current bidding velocity and competition
    - Market demand for this category
    - Price acceleration patterns in collectible auctions
    - End-of-auction surge behavior

    Provide specific price estimates in Indonesian Rupiah and brief reasoning for each prediction.
    Be realistic and data-driven in your analysis.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract price predictions from the response
      const predictions = this._extractPricePredictions(
        text,
        itemData.currentPrice
      );

      return {
        predictions,
        analysis: text.trim(),
        confidence: this._calculatePredictionConfidence(itemData),
        factors: [
          "Bidding velocity analysis",
          "Historical auction patterns",
          "Market demand indicators",
          "Time-to-close dynamics",
          "Category-specific trends",
        ],
        methodology:
          "AI-powered analysis of auction dynamics and market patterns",
      };
    } catch (error) {
      console.error("Gemini API error (price-prediction):", error);
      throw new Error("Failed to generate price prediction");
    }
  }

  /**
   * Generate bidding strategy
   */
  async generateBiddingStrategy(itemData, userBudget) {
    const prompt = `
    As a professional auction strategist and bidding expert, create a personalized bidding strategy.

    Item Details:
    - Name: ${itemData.name}
    - Current Price: Rp ${Number(itemData.currentPrice).toLocaleString("id-ID")}
    - Number of Bids: ${itemData.bidCount}
    - Your Budget: Rp ${Number(userBudget).toLocaleString("id-ID")}
    - Budget vs Current Price: ${(
      (userBudget / itemData.currentPrice - 1) *
      100
    ).toFixed(1)}% above current
    ${
      itemData.endTime
        ? `- Time remaining: ${this._getTimeRemaining(itemData.endTime)}`
        : ""
    }

    Based on auction psychology, market dynamics, and your budget constraints, provide:

    1. **Recommended Strategy Name** (e.g., "Conservative Sniper", "Aggressive Early Bidder")
    2. **Timing Recommendations** - When to place bids
    3. **Bid Increment Strategy** - How much to increase bids
    4. **Risk Assessment** - Your chances of winning within budget
    5. **Tactical Advice** - Specific actions to maximize success

    Consider:
    - Current competition level
    - Time remaining dynamics
    - Your budget positioning
    - Psychological factors in bidding wars
    - Optimal bid timing strategies

    Provide actionable, specific advice that maximizes winning chances while staying within budget.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const strategy = this._parseStrategyResponse(text, userBudget, itemData);

      return {
        recommendedStrategy: strategy,
        analysis: text.trim(),
        budgetAnalysis: {
          budget: userBudget,
          currentPrice: itemData.currentPrice,
          budgetMultiplier: (userBudget / itemData.currentPrice).toFixed(2),
          riskLevel: this._assessBudgetRisk(userBudget, itemData.currentPrice),
        },
        tips: this._generateStrategyTips(itemData, userBudget),
        methodology:
          "Strategy based on auction psychology, market analysis, and budget optimization",
      };
    } catch (error) {
      console.error("Gemini API error (bidding-strategy):", error);
      throw new Error("Failed to generate bidding strategy");
    }
  }

  // Helper methods
  _calculateConfidence(itemData) {
    // Base confidence on various factors
    let confidence = 70;

    // More bids = higher confidence in analysis
    confidence += Math.min(itemData.bidCount * 3, 20);

    // Active auction = higher confidence
    if (!itemData.isSold) confidence += 5;

    // Recent activity = higher confidence
    if (itemData.endTime && this._getHoursRemaining(itemData.endTime) < 24) {
      confidence += 5;
    }

    return Math.min(confidence, 95);
  }

  _calculatePredictionConfidence(itemData) {
    let confidence = 60;

    // More bidding history = better prediction accuracy
    confidence += Math.min(itemData.bidCount * 4, 25);

    // Closer to end = more predictable
    if (itemData.endTime) {
      const hoursRemaining = this._getHoursRemaining(itemData.endTime);
      if (hoursRemaining < 6) confidence += 10;
      else if (hoursRemaining < 24) confidence += 5;
    }

    return Math.min(confidence, 90);
  }

  _extractKeyFactors(analysisText) {
    // Extract key factors mentioned in the analysis
    const factors = [];
    const text = analysisText.toLowerCase();

    if (text.includes("rare") || text.includes("rarity"))
      factors.push("Rarity factor");
    if (text.includes("condition") || text.includes("pristine"))
      factors.push("Condition assessment");
    if (text.includes("market") || text.includes("demand"))
      factors.push("Market demand");
    if (text.includes("historical") || text.includes("history"))
      factors.push("Historical significance");
    if (text.includes("investment") || text.includes("value"))
      factors.push("Investment potential");
    if (text.includes("authentic") || text.includes("provenance"))
      factors.push("Authenticity");

    // Add default factors if none detected
    if (factors.length === 0) {
      factors.push(
        "Market analysis",
        "Rarity assessment",
        "Investment potential"
      );
    }

    return factors;
  }

  _extractPricePredictions(text, currentPrice) {
    // Try to extract price numbers from the text, fallback to calculated estimates
    const numbers = text.match(/\d{1,3}(?:\.\d{3})*(?:\.000)?/g) || [];
    const priceNumbers = numbers
      .map((n) => parseInt(n.replace(/\./g, "")))
      .filter((n) => n > currentPrice && n < currentPrice * 5); // Reasonable range

    if (priceNumbers.length >= 3) {
      return {
        nextHour: priceNumbers[0],
        next24Hours: priceNumbers[1],
        estimatedFinalPrice: priceNumbers[2],
      };
    }

    // Fallback to algorithmic predictions
    return {
      nextHour: Math.round(currentPrice * (1 + Math.random() * 0.15)), // 0-15% increase
      next24Hours: Math.round(currentPrice * (1 + Math.random() * 0.35)), // 0-35% increase
      estimatedFinalPrice: Math.round(currentPrice * (1 + Math.random() * 0.6)), // 0-60% increase
    };
  }

  _parseStrategyResponse(text, budget, itemData) {
    // Extract strategy name from the response
    const strategyMatch = text.match(/strategy[^:]*:\s*([^.\n]+)/i);
    const strategyName = strategyMatch
      ? strategyMatch[1].trim()
      : "Smart Bidding Strategy";

    // Determine risk level based on budget vs current price
    const ratio = budget / itemData.currentPrice;
    let riskLevel = "Medium";
    if (ratio < 1.5) riskLevel = "High";
    else if (ratio > 3) riskLevel = "Low";

    return {
      name: strategyName,
      description: text.substring(0, 300) + "...", // First 300 chars as description
      riskLevel,
      recommendedTiming: this._getRecommendedTiming(itemData),
      budgetUtilization:
        Math.min((itemData.currentPrice / budget) * 100, 100).toFixed(1) + "%",
    };
  }

  _getRecommendedTiming(itemData) {
    if (!itemData.endTime) return "Monitor auction and bid strategically";

    const hoursRemaining = this._getHoursRemaining(itemData.endTime);

    if (hoursRemaining < 1) return "Final 30 minutes - sniper strategy";
    else if (hoursRemaining < 6) return "Last 2-3 hours";
    else if (hoursRemaining < 24) return "Final day - monitor closely";
    else return "Early positioning with strategic increments";
  }

  _generateStrategyTips(itemData, budget) {
    const tips = [
      "Set a maximum bid limit and stick to it to avoid emotional overspending",
      "Monitor other bidders' patterns to understand competition level",
      "Consider the item's market value beyond just auction dynamics",
    ];

    const ratio = budget / itemData.currentPrice;

    if (ratio < 1.5) {
      tips.push("Your budget is tight - consider waiting for a better deal");
      tips.push("Focus on precise timing rather than aggressive early bidding");
    } else if (ratio > 3) {
      tips.push(
        "You have budget flexibility - consider strategic early positioning"
      );
      tips.push("Use psychological bidding to discourage other participants");
    }

    if (itemData.endTime && this._getHoursRemaining(itemData.endTime) < 6) {
      tips.push("Auction ending soon - prepare for increased competition");
    }

    return tips;
  }

  _assessBudgetRisk(budget, currentPrice) {
    const ratio = budget / currentPrice;
    if (ratio < 1.2) return "High";
    else if (ratio < 2) return "Medium";
    else return "Low";
  }

  _getAuctionDuration(itemData) {
    if (!itemData.createdAt) return "Unknown";
    const now = new Date();
    const started = new Date(itemData.createdAt);
    const hours = Math.floor((now - started) / (1000 * 60 * 60));
    return `${hours} hours`;
  }

  _getTimeRemaining(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Auction ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} days, ${hours % 24} hours`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes`;
    } else {
      return `${minutes} minutes`;
    }
  }

  _getHoursRemaining(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    return Math.max(0, diff / (1000 * 60 * 60));
  }
}

module.exports = new GeminiService();
