import React, { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";
import socketService from "../services/socketService";

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth actions
const AuthActions = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
  INIT_AUTH: "INIT_AUTH",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case AuthActions.LOGIN_FAILURE:
    case AuthActions.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case AuthActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AuthActions.INIT_AUTH:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
        loading: false,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app start
  useEffect(() => {
    const initAuth = () => {
      const user = authService.getCurrentUser();
      const token = authService.getToken();
      const isAuthenticated = authService.isAuthenticated();

      dispatch({
        type: AuthActions.INIT_AUTH,
        payload: {
          user,
          token,
          isAuthenticated,
        },
      });

      // Connect socket if authenticated
      if (isAuthenticated) {
        socketService.connect();
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AuthActions.LOGIN_START });

    try {
      console.log("AuthContext: Starting login with credentials:", credentials);

      const response = await authService.login(credentials);
      console.log("AuthContext: Login response from service:", response);

      dispatch({
        type: AuthActions.LOGIN_SUCCESS,
        payload: response,
      });

      // Connect socket after successful login
      socketService.connect();

      console.log("AuthContext: Login completed successfully");
      return response;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      dispatch({
        type: AuthActions.LOGIN_FAILURE,
        payload: error.message || "Login failed",
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AuthActions.REGISTER_START });

    try {
      const response = await authService.register(userData);

      // Don't automatically login user after registration
      // Just return success without setting auth state
      dispatch({
        type: AuthActions.SET_LOADING,
        payload: false,
      });

      return response;
    } catch (error) {
      dispatch({
        type: AuthActions.REGISTER_FAILURE,
        payload: error.message || "Registration failed",
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    socketService.disconnect();

    dispatch({ type: AuthActions.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AuthActions.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
