// Format currency to Indonesian Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable format
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return formatDate(dateString);
};

// Format time remaining for auction
export const formatTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffInSeconds = Math.floor((end - now) / 1000);

  if (diffInSeconds <= 0) {
    return "Auction ended";
  }

  const days = Math.floor(diffInSeconds / (24 * 60 * 60));
  const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
  const seconds = diffInSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Check if auction is active
export const isAuctionActive = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return now >= start && now <= end;
};

// Check if auction is upcoming
export const isAuctionUpcoming = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);

  return now < start;
};

// Check if auction has ended
export const isAuctionEnded = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);

  return now > end;
};

// Calculate auction status
export const getAuctionStatus = (startDate, endDate) => {
  if (isAuctionUpcoming(startDate)) {
    return "upcoming";
  } else if (isAuctionActive(startDate, endDate)) {
    return "active";
  } else {
    return "ended";
  }
};

// Format bid amount with minimum increment
export const formatBidIncrement = (currentBid, minIncrement = 10000) => {
  return currentBid + minIncrement;
};

// Validate bid amount
export const validateBidAmount = (
  bidAmount,
  currentHighestBid,
  minIncrement = 10000
) => {
  const minBid = currentHighestBid + minIncrement;

  if (bidAmount < minBid) {
    return {
      isValid: false,
      message: `Minimum bid is ${formatCurrency(minBid)}`,
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
};

// Generate random placeholder image
export const getPlaceholderImage = (width = 400, height = 300) => {
  return `https://picsum.photos/${width}/${height}?random=${Math.floor(
    Math.random() * 1000
  )}`;
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
