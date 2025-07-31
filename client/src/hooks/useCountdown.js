import { useState, useEffect } from "react";
import { formatTimeRemaining } from "../utils/helpers";

export const useCountdown = (endDate) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = formatTimeRemaining(endDate);
      setTimeRemaining(remaining);
      setIsExpired(remaining === "Auction ended");
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  return { timeRemaining, isExpired };
};

export default useCountdown;
