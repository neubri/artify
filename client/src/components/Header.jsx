import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-artsy-white border-b border-artsy-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif text-artsy-black tracking-tight">
                Artify
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/items"
              className={`text-sm transition-colors duration-200 ${
                isActive("/items")
                  ? "text-artsy-black border-b-2 border-artsy-black pb-4"
                  : "text-artsy-gray-700 hover:text-artsy-black"
              }`}
            >
              Artworks
            </Link>
            
            <Link
              to="/artists"
              className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
            >
              Artists
            </Link>

            <Link
              to="/auctions"
              className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
            >
              Auctions
            </Link>

            <Link
              to="/viewing-rooms"
              className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
            >
              Viewing Rooms
            </Link>

            <Link
              to="/galleries"
              className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
            >
              Galleries
            </Link>

            <Link
              to="/fairs"
              className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
            >
              Fairs
            </Link>

            <Link
              to="/shows"
              className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
            >
              Shows
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-artsy-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-3 py-2 text-sm border border-artsy-gray-300 focus:outline-none focus:border-artsy-black transition-colors duration-200"
                  placeholder="Search artists, artworks..."
                />
              </div>
            </form>

            {isAuthenticated ? (
              <>
                <Link
                  to="/sell"
                  className="hidden md:block text-sm text-artsy-black hover:underline transition-colors duration-200"
                >
                  Sell
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200">
                    <div className="w-8 h-8 bg-artsy-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-artsy-gray-600" />
                    </div>
                    <span className="hidden md:block">{user?.username || user?.email}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-artsy-white border border-artsy-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-artsy-gray-700 hover:bg-artsy-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-bids"
                        className="block px-4 py-2 text-sm text-artsy-gray-700 hover:bg-artsy-gray-50"
                      >
                        My Bids
                      </Link>
                      <Link
                        to="/my-items"
                        className="block px-4 py-2 text-sm text-artsy-gray-700 hover:bg-artsy-gray-50"
                      >
                        My Items
                      </Link>
                      <hr className="my-1 border-artsy-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-artsy-gray-700 hover:bg-artsy-gray-50"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-artsy-gray-700 hover:text-artsy-black transition-colors duration-200"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-artsy-black text-artsy-white text-sm hover:bg-artsy-gray-900 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 text-artsy-gray-700 hover:text-artsy-black focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-artsy-gray-200">
          <div className="px-6 py-4 space-y-4 bg-artsy-white">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-artsy-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-artsy-gray-300 focus:outline-none focus:border-artsy-black transition-colors duration-200"
                  placeholder="Search artists, artworks..."
                />
              </div>
            </form>

            <div className="space-y-1">
              <Link
                to="/items"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
              >
                Artworks
              </Link>
              <Link
                to="/artists"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
              >
                Artists
              </Link>
              <Link
                to="/auctions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
              >
                Auctions
              </Link>
              <Link
                to="/galleries"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
              >
                Galleries
              </Link>

              {isAuthenticated ? (
                <>
                  <hr className="my-2 border-artsy-gray-200" />
                  <Link
                    to="/sell"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
                  >
                    Sell
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-bids"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
                  >
                    My Bids
                  </Link>
                  <Link
                    to="/my-items"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
                  >
                    My Items
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2 border-artsy-gray-200" />
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm text-artsy-gray-700 hover:text-artsy-black"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-4 bg-artsy-black text-artsy-white text-sm hover:bg-artsy-gray-900"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
