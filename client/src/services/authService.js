import api from "./api";

export const authService = {
  // User registration
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      // Don't automatically save token on registration
      // Just return the response without logging in
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // User login
  login: async (credentials) => {
    try {
      console.log(
        "AuthService: Making login request to backend with:",
        credentials
      );

      const response = await api.post("/auth/login", credentials);
      console.log("AuthService: Backend response:", response.data);

      // Backend response structure: { success: true, data: { user: {...}, token: "..." } }
      if (response.data.data && response.data.data.token) {
        console.log(
          "AuthService: Saving token to localStorage:",
          response.data.data.token
        );
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Verify token was saved
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        console.log("AuthService: Verification - token saved:", savedToken);
        console.log("AuthService: Verification - user saved:", savedUser);
      } else {
        console.error("AuthService: No token found in response data");
      }

      return response.data.data; // Return the actual data with user and token
    } catch (error) {
      console.error("AuthService: Login error:", error);
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // User logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (parseError) {
      console.error("Error parsing user from localStorage:", parseError);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
