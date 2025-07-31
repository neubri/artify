import api from "./api";

export const bidsService = {
  // Get bids for an item
  getBids: async (itemId, params = {}) => {
    try {
      const response = await api.get(`/bids/${itemId}`, { params });
      return response.data.data.bids || []; // Extract bids array from response
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch bids" };
    }
  },

  // Get user's bids
  getUserBids: async (params = {}) => {
    try {
      const response = await api.get("/bids/my-bids", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user bids" };
    }
  },

  // Place a bid
  placeBid: async (itemId, bidData) => {
    try {
      const response = await api.post("/bids", {
        itemId: parseInt(itemId),
        ...bidData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to place bid" };
    }
  },
};

export default bidsService;
