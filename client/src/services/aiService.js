import api from "./api";

export const aiService = {
  // Get AI analysis of why an item is worth it
  getWhyWorthItAnalysis: async (itemData) => {
    try {
      const response = await api.post("/ai/why-worth-it", itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get AI analysis" };
    }
  },

  // Get AI price prediction
  getPricePrediction: async (itemData) => {
    try {
      const response = await api.post("/ai/price-prediction", itemData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to get price prediction" }
      );
    }
  },

  // Get AI bidding strategy
  getBiddingStrategy: async (strategyData) => {
    try {
      const response = await api.post("/ai/bidding-strategy", strategyData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to get bidding strategy" }
      );
    }
  },
};

export default aiService;
