import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import itemsService from "../services/itemsService";
import {
  formatCurrency,
  formatTimeRemaining,
  getPlaceholderImage,
} from "../utils/helpers";
import { LoadingCard } from "../components/Loading";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("featured");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        if (isAuthenticated) {
          const response = await itemsService.getItems({
            search: searchParams.get("search") || "",
            limit: 20,
          });

          setItems(response.items || []);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [isAuthenticated, searchParams]);

  const ArtworkCard = ({ item }) => (
    <Link to={`/items/${item.id}`} className="group block">
      <div className="bg-artsy-white hover:bg-artsy-gray-50 transition-colors duration-200">
        <div className="relative overflow-hidden">
          <img
            src={item.imageUrl || getPlaceholderImage(400, 500)}
            alt={item.name}
            className="w-full aspect-[4/5] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.endTime && (
            <div className="absolute top-3 right-3 bg-artsy-black text-artsy-white px-2 py-1 text-xs font-medium">
              {formatTimeRemaining(item.endTime)}
            </div>
          )}
        </div>

        <div className="py-4">
          <div className="text-artsy-gray-600 text-sm mb-1">
            {item.category || "Contemporary Art"}
          </div>
          <h3 className="text-artsy-black font-medium mb-2 group-hover:underline line-clamp-2">
            {item.name}
          </h3>
          <div className="text-artsy-gray-600 text-sm mb-3 line-clamp-1">
            {item.artist || "Artist Name"}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-artsy-gray-600 text-xs">Current bid</div>
              <div className="text-artsy-black font-medium">
                {formatCurrency(item.currentPrice || item.startingPrice)}
              </div>
            </div>
            <div className="text-artsy-gray-600 text-xs">
              {item.bidCount || 0} bid{(item.bidCount || 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-artsy-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-serif text-artsy-black mb-6">
            Discover Art You Love
          </h1>
          <p className="text-lg text-artsy-gray-700 mb-8">
            Sign up to see pricing and make offers on works by today's leading artists.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/register"
              className="px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 text-center"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200 text-center"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artsy-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-artsy-black mb-4">
            All Artworks
          </h1>
          <p className="text-lg text-artsy-gray-700">
            Works available for purchase and bidding.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-artsy-gray-500" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  className="w-full pl-10 pr-4 py-3 border border-artsy-gray-300 focus:outline-none focus:border-artsy-black transition-colors duration-200"
                  defaultValue={searchParams.get("search") || ""}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      newParams.set("search", e.target.value);
                    } else {
                      newParams.delete("search");
                    }
                    setSearchParams(newParams);
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-artsy-gray-300 focus:outline-none focus:border-artsy-black transition-colors duration-200 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="ending_soon">Ending Soon</option>
                <option value="recently_added">Recently Added</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-artsy-gray-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" 
                      ? "bg-artsy-black text-artsy-white" 
                      : "bg-artsy-white text-artsy-black hover:bg-artsy-gray-100"
                  } transition-colors duration-200`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" 
                      ? "bg-artsy-black text-artsy-white" 
                      : "bg-artsy-white text-artsy-black hover:bg-artsy-gray-100"
                  } transition-colors duration-200`}
                >
                  <ViewColumnsIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Filters */}
              <button className="flex items-center gap-2 px-4 py-2 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200">
                <FunnelIcon className="h-4 w-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && items.length > 0 && (
          <div className="mb-6">
            <p className="text-artsy-gray-600 text-sm">
              {items.length} work{items.length !== 1 ? 's' : ''} available
            </p>
          </div>
        )}

        {/* Items Grid/List */}
        {loading ? (
          <div className={`grid gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {[...Array(12)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-serif text-artsy-black mb-4">
              No works found
            </h3>
            <p className="text-artsy-gray-600 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
                setSortBy("featured");
              }}
              className="px-6 py-2 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {items.map((item) => (
              <ArtworkCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && items.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200">
              Show more works
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
