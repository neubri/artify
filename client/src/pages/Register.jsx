import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { LoadingButton } from "../components/Loading";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { showSuccess } from "../utils/notifications";

const Register = () => {
  const { register: registerUser, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      clearError();

      await registerUser(data);

      // Show success notification
      showSuccess(
        'Registration Successful!',
        'Your account has been created. Please log in to continue.',
        {
          confirmText: 'Go to Login',
          allowOutsideClick: false,
          allowEscapeKey: false
        }
      ).then(() => {
        // Redirect to login page after user confirms
        navigate("/login");
      });
    } catch (error) {
      console.error("Registration error:", error);
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
                Sign up for Artify
              </h2>
              <p className="mt-2 text-sm text-artsy-gray-600">
                Discover and collect art from galleries around the world.
              </p>
            </div>

            {/* Form */}
            <div className="mt-8">
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-artsy-black mb-2"
                  >
                    Username
                  </label>
                  <input
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    type="text"
                    autoComplete="username"
                    className={`w-full px-3 py-3 border transition-colors duration-200 focus:outline-none ${
                      errors.username
                        ? "border-red-500 focus:border-red-500"
                        : "border-artsy-gray-300 focus:border-artsy-black"
                    }`}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>

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
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
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

                {/* Terms */}
                <div className="text-xs text-artsy-gray-600">
                  By signing up, you agree to Artify's{" "}
                  <a href="#" className="underline hover:text-artsy-black">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-artsy-black">
                    Privacy Policy
                  </a>.
                </div>

                {/* Submit Button */}
                <div>
                  <LoadingButton
                    type="submit"
                    loading={isLoading}
                    className="w-full py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign up"}
                  </LoadingButton>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <span className="text-sm text-artsy-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-artsy-black hover:underline"
                    >
                      Log in
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
                Join the art world's marketplace
              </h3>
              <p className="text-artsy-gray-600 leading-relaxed">
                Connect with galleries, discover emerging artists, and build your collection
                with works from around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
