import api from "./api";

export const itemsService = {
  // Get all items with pagination and filters
  getItems: async (params = {}) => {
    try {
      const response = await api.get("/items", { params });
      return response.data.data; // Extract data from response
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch items" };
    }
  },

  // Get single item by ID
  getItem: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data.data.item; // Extract item from response.data.data.item
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch item" };
    }
  },

  // Create new item (seller)
  createItem: async (itemData) => {
    try {
      const response = await api.post("/items", itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create item" };
    }
  },

  // Update item (seller)
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update item" };
    }
  },

  // Delete item (seller)
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete item" };
    }
  },
};

export default itemsService;
