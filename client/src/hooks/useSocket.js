import { useEffect, useCallback } from "react";
import socketService from "../services/socketService";
import { useAuth } from "../context/AuthContext";

export const useSocket = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('useSocket effect triggered:', { isAuthenticated, isConnected: socketService.isConnected() });
    
    if (isAuthenticated && !socketService.isConnected()) {
      console.log('🔌 Connecting socket...');
      socketService.connect();
    } else if (!isAuthenticated && socketService.isConnected()) {
      console.log('🔌 Disconnecting socket...');
      socketService.disconnect();
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, [isAuthenticated]);

  // Join item auction room
  const joinItem = useCallback((itemId) => {
    socketService.joinItem(itemId);
  }, []);

  // Leave item auction room
  const leaveItem = useCallback((itemId) => {
    socketService.leaveItem(itemId);
  }, []);

  // Place bid via socket
  const placeBid = useCallback((bidData) => {
    socketService.placeBid(bidData);
  }, []);

  // Listen for new bids
  const onNewBid = useCallback((callback) => {
    socketService.onNewBid(callback);

    return () => {
      socketService.off("new-bid", callback);
    };
  }, []);

  // Listen for bid errors
  const onBidError = useCallback((callback) => {
    socketService.onBidError(callback);

    return () => {
      socketService.off("bid-error", callback);
    };
  }, []);

  // Listen for auction updates
  const onAuctionUpdate = useCallback((callback) => {
    socketService.onAuctionUpdate(callback);

    return () => {
      socketService.off("auction-update", callback);
    };
  }, []);

  return {
    isConnected: socketService.isConnected(),
    joinItem,
    leaveItem,
    placeBid,
    onNewBid,
    onBidError,
    onAuctionUpdate,
    socket: socketService.getSocket(),
  };
};

export default useSocket;
