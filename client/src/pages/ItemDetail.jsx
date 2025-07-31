import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import itemsService from "../services/itemsService";
import bidsService from "../services/bidsService";
import aiService from "../services/aiService";
import { showSuccess, showError, showWarning, showInfo, showToast } from "../utils/notifications";
import {
  formatCurrency,
  formatTimeRemaining,
  formatRelativeTime,
  getPlaceholderImage,
} from "../utils/helpers";
import { LoadingPage } from "../components/Loading";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  // AI features state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [pricePrediction, setPricePrediction] = useState(null);
  const [biddingStrategy, setBiddingStrategy] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now()); // Add refresh key

  // Check if current user is the highest bidder
  const isCurrentUserHighestBidder = () => {
    if (!isAuthenticated || !user || !bids || bids.length === 0) {
      console.log('❌ Highest bidder check: Not authenticated or no bids', {
        isAuthenticated,
        hasUser: !!user,
        bidsLength: bids?.length || 0
      });
      return false;
    }
    
    const highestBid = bids[0]; // Bids are sorted by amount desc
    const isHighest = highestBid.user?.id === user.id;
    
    console.log('🏆 Highest bidder check:', {
      currentUserId: user.id,
      highestBidderId: highestBid.user?.id,
      highestBidAmount: highestBid.amount,
      isHighest
    });
    
    return isHighest;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch item details and bids
      const [itemResponse, bidsResponse] = await Promise.all([
        itemsService.getItem(id),
        bidsService.getBids(id).catch(() => []), // Fallback to empty array
      ]);

      setItem(itemResponse);
      setBids(Array.isArray(bidsResponse) ? bidsResponse : []);        // Set minimum bid amount
        const currentPrice =
          itemResponse.currentPrice || itemResponse.startingPrice;
        setBidAmount((parseInt(currentPrice) + 100000).toString());
      } catch (error) {
        console.error("Error fetching item:", error);
        // navigate('/items');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, isAuthenticated]);

  // Socket.IO real-time bid updates
  useEffect(() => {
    if (!socket || !isConnected || !id) {
      console.log('Socket conditions not met:', { 
        hasSocket: !!socket, 
        isConnected, 
        id,
        socketId: socket?.id 
      });
      return;
    }

    console.log('✅ Setting up socket listeners for item:', id);

    // Join item room for real-time updates
    socket.emit('join-item', { itemId: parseInt(id) });
    console.log('📡 Emitted join-item for item:', id);

    // Listen for new bids
    const handleNewBid = (bidData) => {
      console.log('🔔 New bid received via socket:', bidData);
      
      // Update bids list with new bid
      setBids(prevBids => {
        const newBid = {
          id: bidData.id,
          amount: bidData.amount,
          user: bidData.user,
          createdAt: bidData.createdAt,
          itemId: bidData.itemId
        };
        
        console.log('📝 Updating bids list with new bid:', newBid);
        
        // Add to top of list and remove duplicates
        const updatedBids = [newBid, ...prevBids.filter(bid => bid.id !== newBid.id)];
        console.log('📋 Updated bids list length:', updatedBids.length);
        return updatedBids;
      });

      // Update item current price and bid count
      setItem(prevItem => {
        const updatedItem = {
          ...prevItem,
          currentPrice: bidData.currentPrice || bidData.amount,
          bidCount: bidData.bidCount || (prevItem.bidCount || 0) + 1
        };
        console.log('💰 Updated item current price:', updatedItem.currentPrice);
        return updatedItem;
      });

      // Update refresh key to force re-render
      setRefreshKey(Date.now());

      // Show notification for new bid (except for current user's own bid)
      if (user && bidData.user?.id !== user.id) {
        console.log('🔔 Showing notification for bid from:', bidData.user?.username);
        // Small toast notification for other users' bids
        showToast(`${bidData.user?.username} bid ${formatCurrency(bidData.amount)}`, 'info', {
          timer: 3000
        });

        // Update minimum bid amount if current user was about to bid
        const newMinBid = parseInt(bidData.amount) + 100000;
        setBidAmount(newMinBid.toString());
      } else {
        console.log('🤐 Not showing notification - bid from current user');
      }
    };

    socket.on('new-bid', handleNewBid);
    console.log('👂 Added new-bid listener');

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('new-bid', handleNewBid);
      socket.emit('leave-item', { itemId: parseInt(id) });
    };
  }, [socket, isConnected, id, user]);

  // Fetch AI insights
  const fetchAIInsights = async () => {
    if (!isAuthenticated || !item) return;

    try {
      setLoadingAI(true);

      const [analysisResult, predictionResult, strategyResult] =
        await Promise.allSettled([
          aiService.getWhyWorthItAnalysis({ itemId: parseInt(id) }),
          aiService.getPricePrediction({ itemId: parseInt(id) }),
          aiService.getBiddingStrategy({
            itemId: parseInt(id),
            userBudget: parseInt(item.currentPrice || item.startingPrice) * 1.5, // Set budget as 1.5x current price
          }),
        ]);

      if (analysisResult.status === "fulfilled") {
        setAiAnalysis(analysisResult.value.data);
      }
      if (predictionResult.status === "fulfilled") {
        setPricePrediction(predictionResult.value.data);
      }
      if (strategyResult.status === "fulfilled") {
        setBiddingStrategy(strategyResult.value.data);
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      showError(
        'AI Analysis Failed',
        'Unable to fetch AI insights at the moment. Please try again later.'
      );
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showInfo(
        'Login Required',
        'Please login first to place a bid',
        {
          confirmText: 'Go to Login',
          showCancel: true,
          cancelText: 'Cancel'
        }
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (!bidAmount || submittingBid) {
      return;
    }

    // Check if current user is already the highest bidder
    if (isCurrentUserHighestBidder()) {
      showInfo(
        'You\'re Already the Highest Bidder!',
        'You cannot place another bid until someone else outbids you.',
        { confirmText: 'Got it!' }
      );
      return;
    }

    try {
      setSubmittingBid(true);

      await bidsService.placeBid(id, {
        amount: parseInt(bidAmount),
      });

      // Backend will emit socket event automatically after successful bid
      // No need to emit from frontend

      // Refresh data after successful bid
      const [itemResponse, bidsResponse] = await Promise.all([
        itemsService.getItem(id),
        bidsService.getBids(id).catch(() => []), // Fallback to empty array
      ]);

      setItem(itemResponse);
      setBids(Array.isArray(bidsResponse) ? bidsResponse : []);
      setRefreshKey(Date.now()); // Force re-render of bid list

      // Update bid amount to new minimum
      const newMinBid = parseInt(itemResponse.currentPrice) + 100000;
      setBidAmount(newMinBid.toString());

      showSuccess(
        'Bid Placed Successfully!',
        `Your bid of ${formatCurrency(bidAmount)} has been placed.`,
        { confirmText: 'Great!', timer: 3000 }
      );
    } catch (error) {
      console.error("Error placing bid:", error);
      console.error("Error details:", error.response?.data);

      if (
        error.response?.data?.message === "Access token required" ||
        error.message?.includes("Access token required")
      ) {
        showWarning(
          'Session Expired',
          'Your session has expired. Please login again.',
          {
            confirmText: 'Login',
            showCancel: true,
            cancelText: 'Cancel'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        showError(
          'Bid Failed',
          'Failed to place bid. Please try again.'
        );
      }
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading item details..." />;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-artsy-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-3xl font-serif text-artsy-black mb-4">
            Artwork Not Found
          </h1>
          <p className="text-artsy-gray-600 mb-8">
            The artwork you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/items")}
            className="px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200"
          >
            Back to Artworks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artsy-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Artwork Image - Takes 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="aspect-[4/5] bg-artsy-gray-100 overflow-hidden">
              <img
                src={item.imageUrl || getPlaceholderImage(600, 750)}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = getPlaceholderImage(600, 750);
                }}
              />
            </div>
          </div>

          {/* Artwork Details - Takes 1/3 on desktop */}
          <div className="space-y-8">
            {/* Artwork Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-serif text-artsy-black mb-2">
                  {item.name}
                </h1>
                <div className="text-sm text-artsy-gray-600 mb-4">
                  {item.category || "Contemporary Art"}
                </div>
                <div className="text-artsy-gray-700 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </div>

            {/* Auction Status */}
            <div className="border-t border-artsy-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Live Auction' : 'Offline'}
                  </span>
                </div>
                <div className="flex items-center text-artsy-gray-600 text-sm">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{formatTimeRemaining(item.endTime)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-artsy-gray-600 mb-1">Current Bid</div>
                  <div className="text-2xl font-medium text-artsy-black">
                    {formatCurrency(item.currentPrice || item.startingPrice)}
                  </div>
                  <div className="text-sm text-artsy-gray-600">
                    {item.bidCount || 0} bid{(item.bidCount || 0) !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Bid Form */}
                {isAuthenticated ? (
                  isCurrentUserHighestBidder() ? (
                    <div className="p-4 bg-green-50 border border-green-200 text-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <p className="text-green-800 font-medium mb-1">
                        You're the Highest Bidder
                      </p>
                      <p className="text-green-600 text-sm">
                        You cannot place another bid until someone else outbids you.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-artsy-black mb-2">
                          Place your bid
                        </label>
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-artsy-gray-400" />
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-artsy-gray-300 focus:outline-none focus:border-artsy-black transition-colors duration-200"
                            placeholder="Enter bid amount"
                            min={
                              parseInt(item.currentPrice || item.startingPrice) +
                              100000
                            }
                            step="1000"
                          />
                        </div>
                        <p className="text-xs text-artsy-gray-500 mt-1">
                          Minimum bid: {formatCurrency(
                            parseInt(item.currentPrice || item.startingPrice) +
                              100000
                          )}
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={submittingBid}
                        className="w-full py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 disabled:opacity-50 transition-colors duration-200 font-medium"
                      >
                        {submittingBid ? "Placing Bid..." : "Place Bid"}
                      </button>
                    </form>
                  )
                ) : (
                  <div className="text-center p-6 border border-artsy-gray-200">
                    <p className="text-artsy-gray-600 mb-4">
                      Sign up to place a bid
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate("/register")}
                        className="w-full py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 font-medium"
                      >
                        Sign up to bid
                      </button>
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200"
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights Section */}
            {isAuthenticated && (
              <div className="border-t border-artsy-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-artsy-black flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-purple-500" />
                    AI Insights
                  </h3>
                  <button
                    onClick={fetchAIInsights}
                    disabled={loadingAI}
                    className="text-sm px-4 py-2 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white disabled:opacity-50 transition-colors duration-200"
                  >
                    {loadingAI ? "Analyzing..." : "Analyze"}
                  </button>
                </div>

                {(aiAnalysis || pricePrediction || biddingStrategy) && (
                  <div className="space-y-4">
                    {/* Why Worth It Analysis */}
                    {aiAnalysis && (
                      <div className="p-4 bg-blue-50 border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2 flex items-center text-sm">
                          <LightBulbIcon className="h-4 w-4 mr-2" />
                          Investment Analysis
                        </h4>
                        <div className="text-sm text-blue-800 mb-3">
                          {aiAnalysis.analysis && aiAnalysis.analysis.length > 0 ? (
                            <p>{aiAnalysis.analysis}</p>
                          ) : (
                            <p>This artwork shows strong potential based on market factors, rarity, and current demand trends.</p>
                          )}
                        </div>
                        {aiAnalysis.factors && aiAnalysis.factors.length > 0 && (
                          <div className="text-xs text-blue-600 mb-2">
                            <p className="font-medium">Key Factors:</p>
                            <ul className="list-disc list-inside mt-1">
                              {aiAnalysis.factors.slice(0, 3).map((factor, index) => (
                                <li key={index}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-xs text-blue-600">
                          <span className="font-medium">AI Confidence:</span> {aiAnalysis.confidence}%
                        </div>
                      </div>
                    )}

                    {/* Price Prediction */}
                    {pricePrediction && (
                      <div className="p-4 bg-green-50 border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2 flex items-center text-sm">
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                          Price Prediction
                        </h4>
                        <div className="space-y-1 text-sm text-green-800">
                          <p>Next Hour: <span className="font-medium">{formatCurrency(pricePrediction.predictions?.nextHour)}</span></p>
                          <p>Next 24h: <span className="font-medium">{formatCurrency(pricePrediction.predictions?.next24Hours)}</span></p>
                          <p>Final Est.: <span className="font-medium">{formatCurrency(pricePrediction.predictions?.estimatedFinalPrice)}</span></p>
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                          Confidence: {pricePrediction.confidence}%
                        </div>
                      </div>
                    )}

                    {/* Bidding Strategy */}
                    {biddingStrategy && (
                      <div className="p-4 bg-orange-50 border border-orange-200">
                        <h4 className="font-medium text-orange-900 mb-2 flex items-center text-sm">
                          <ChartBarIcon className="h-4 w-4 mr-2" />
                          Bidding Strategy
                        </h4>
                        {biddingStrategy.strategy && (
                          <div className="mb-2">
                            <p className="font-medium text-orange-900 text-sm">
                              {biddingStrategy.strategy.name}
                            </p>
                            <p className="text-sm text-orange-800 mt-1">
                              {biddingStrategy.strategy.description ||
                                biddingStrategy.analysis ||
                                "Strategic recommendations generated."}
                            </p>
                          </div>
                        )}
                        {biddingStrategy.tips && biddingStrategy.tips.length > 0 && (
                          <div className="text-xs text-orange-600">
                            <p className="font-medium">Key Tip:</p>
                            <p>{biddingStrategy.tips[0]}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!aiAnalysis && !pricePrediction && !biddingStrategy && !loadingAI && (
                  <p className="text-artsy-gray-600 text-sm py-4">
                    Get AI-powered analysis to help with your bidding decisions.
                  </p>
                )}

                <div className="mt-4 text-xs text-artsy-gray-500">
                  <p>Powered by Google Gemini • AI predictions are for informational purposes only</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bid History - Full width below */}
        <div className="mt-12 border-t border-artsy-gray-200 pt-8">
          <h2 className="text-xl font-serif text-artsy-black mb-6 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Bidding Activity
          </h2>

          {Array.isArray(bids) && bids.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-artsy-gray-600">No bids yet. Be the first to bid on this artwork.</p>
            </div>
          ) : (
            <div className="space-y-3" key={refreshKey}>
              {Array.isArray(bids) &&
                bids.map((bid, index) => (
                  <div
                    key={`${bid.id}-${refreshKey}`}
                    className={`flex items-center justify-between p-4 border border-artsy-gray-200 transition-all duration-500 ${
                      index === 0 && bid.id ? 'animate-pulse border-green-300 bg-green-50' : 'bg-artsy-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-artsy-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-artsy-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-artsy-black">
                          {bid.user?.username || "Anonymous"}
                        </p>
                        <p className="text-sm text-artsy-gray-500">
                          {formatRelativeTime(bid.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-artsy-black">
                        {formatCurrency(bid.amount)}
                      </p>
                      <div className="flex items-center justify-end space-x-2 mt-1">
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1">
                            Highest
                          </span>
                        )}
                        {user && bid.user?.id === user.id && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1">
                            Your Bid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
