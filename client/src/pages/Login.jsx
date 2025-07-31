import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { LoadingButton } from "../components/Loading";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { showError, showSuccess } from "../utils/notifications";

const Login = () => {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Get redirect path from location state or default to items page
  const from = location.state?.from?.pathname || "/items";

  // Handle redirect after successful authentication
  useEffect(() => {
    if (loginSuccess && isAuthenticated) {
      console.log("Authentication successful, redirecting to:", from);
      
      // Show success notification
      showSuccess(
        'Welcome Back!', 
        'Login successful. Redirecting...',
        { timer: 1500, showConfirmButton: false }
      );
      
      // Redirect after showing notification
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    }
  }, [isAuthenticated, loginSuccess, navigate, from]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();

      console.log("=== DEBUG LOGIN ===");
      console.log("Login data:", data);
      console.log("Before login - isAuthenticated:", isAuthenticated);

      const result = await login(data);
      console.log("Login result:", result);

      // Check if token was saved
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      console.log("Token saved:", savedToken);
      console.log("User saved:", savedUser);
      console.log("==================");

      // Set flag to trigger redirect in useEffect
      setLoginSuccess(true);
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Show error notification
      showError(
        'Login Failed',
        error.response?.data?.message || 'Invalid email or password. Please try again.',
        { timer: 3000 }
      );
      
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-artsy-white">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div>
              <Link to="/" className="inline-block">
                <span className="text-3xl font-serif text-artsy-black tracking-tight">
                  Artify
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="mt-8">
              <h2 className="text-3xl font-serif text-artsy-black">
                Log in to Artify
              </h2>
              <p className="mt-2 text-sm text-artsy-gray-600">
                Welcome back. Sign in to your account.
              </p>
              
              {/* Demo credentials hint */}
              <div className="mt-4 p-3 bg-artsy-gray-50 border border-artsy-gray-200 text-xs">
                <p className="font-medium text-artsy-black mb-1">Demo Credentials:</p>
                <p className="text-artsy-gray-600">Email: user123@test.com</p>
                <p className="text-artsy-gray-600">Password: password123</p>
              </div>
            </div>

            {/* Form */}
            <div className="mt-8">
              {/* Success Message from Registration */}
              {location.state?.message && (
                <div className="mb-6 p-4 border border-green-300 bg-green-50 text-green-700 text-sm">
                  {location.state.message}
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-artsy-black mb-2"
                  >
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className={`w-full px-3 py-3 border transition-colors duration-200 focus:outline-none ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-artsy-gray-300 focus:border-artsy-black"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-artsy-black mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password", {
                        required: "Password is required",
                      })}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`w-full px-3 py-3 pr-10 border transition-colors duration-200 focus:outline-none ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-artsy-gray-300 focus:border-artsy-black"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-artsy-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-artsy-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-artsy-black hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>

                {/* Submit Button */}
                <div>
                  <LoadingButton
                    type="submit"
                    loading={isLoading}
                    className="w-full py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Log in"}
                  </LoadingButton>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <span className="text-sm text-artsy-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-artsy-black hover:underline"
                    >
                      Sign up
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 h-full w-full bg-artsy-gray-100 flex items-center justify-center">
            <div className="text-center max-w-md px-8">
              <h3 className="text-2xl font-serif text-artsy-black mb-4">
                Welcome back to Artify
              </h3>
              <p className="text-artsy-gray-600 leading-relaxed">
                Continue exploring the world's best artworks and connect with galleries,
                artists, and collectors worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
