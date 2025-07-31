# 🎯 Artify API Documentation

## 📋 Overview

Artify adalah platform lelang real-time untuk barang koleksi dengan fitur AI-powered analysis menggunakan Google Gemini 1.5 Flash.

**Base URL:** `http://localhost:3001/api`
**Version:** 1.0.0
**AI Engine:** Google Gemini 1.5 Flash

---

## 🔐 Authentication

### Headers Required for Protected Routes:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 📚 API Endpoints

### 🏥 Health Check

#### `GET /health`

Check server status and health.

**Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "message": "Artify API is running!",
  "timestamp": "2025-07-30T20:18:40.017Z",
  "version": "1.0.0"
}
```

**Status Codes:**

- `200 OK` - Server is healthy

---

## 👤 Authentication Endpoints

### 📝 Register User

#### `POST /auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2025-07-30T20:03:41.487Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing fields
{
  "success": false,
  "message": "Username, email, and password are required"
}

// 400 Bad Request - User exists
{
  "success": false,
  "message": "User with this email already exists"
}

// 400 Bad Request - Validation error
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

**Status Codes:**

- `201 Created` - User registered successfully
- `400 Bad Request` - Validation error or user exists
- `500 Internal Server Error` - Server error

### 🔑 Login User

#### `POST /auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing fields
{
  "success": false,
  "message": "Email and password are required"
}

// 401 Unauthorized - Invalid credentials
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Status Codes:**

- `200 OK` - Login successful
- `400 Bad Request` - Missing fields
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

## 🏺 Items Endpoints

### 📋 Get All Items

#### `GET /items`

**Headers:**

```
Content-Type: application/json
```

**Query Parameters:**

```
page: number (optional, default: 1)
limit: number (optional, default: 10, max: 50)
search: string (optional, search in name/description)
status: string (optional, 'active' | 'sold' | 'all', default: 'all')
```

**Example Request:**

```
GET /items?page=1&limit=5&search=camera&status=active
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Vintage Leica M3 Camera (1955)",
        "description": "A pristine 1950s-era Leica M3 rangefinder camera...",
        "startingPrice": "5000000.00",
        "imageUrl": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
        "isSold": false,
        "endTime": "2025-07-31T20:03:41.487Z",
        "createdAt": "2025-07-30T20:03:41.487Z",
        "updatedAt": "2025-07-30T20:03:41.487Z",
        "currentPrice": "6000000.00",
        "bidCount": 5,
        "timeRemaining": "23h 45m",
        "bids": [
          {
            "id": 16,
            "amount": "6000000.00",
            "userId": 6,
            "createdAt": "2025-07-30T20:03:41.487Z",
            "user": {
              "id": 6,
              "username": "collector_pro"
            }
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 10,
      "itemsPerPage": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Status Codes:**

- `200 OK` - Items retrieved successfully
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server error

### 🔍 Get Item by ID

#### `GET /items/:id`

**Headers:**

```
Content-Type: application/json
```

**Path Parameters:**

```
id: number (required) - Item ID
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": {
    "item": {
      "id": 1,
      "name": "Vintage Leica M3 Camera (1955)",
      "description": "A pristine 1950s-era Leica M3 rangefinder camera...",
      "startingPrice": "5000000.00",
      "imageUrl": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
      "isSold": false,
      "endTime": "2025-07-31T20:03:41.487Z",
      "createdAt": "2025-07-30T20:03:41.487Z",
      "updatedAt": "2025-07-30T20:03:41.487Z",
      "currentPrice": "6000000.00",
      "bidCount": 5,
      "timeRemaining": "23h 45m",
      "bids": [
        {
          "id": 16,
          "amount": "6000000.00",
          "userId": 6,
          "createdAt": "2025-07-30T20:03:41.487Z",
          "user": {
            "id": 6,
            "username": "collector_pro"
          }
        }
      ]
    }
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Item not found"
}

// 400 Bad Request
{
  "success": false,
  "message": "Invalid item ID"
}
```

**Status Codes:**

- `200 OK` - Item found
- `400 Bad Request` - Invalid ID format
- `404 Not Found` - Item not found
- `500 Internal Server Error` - Server error

---

## 💰 Bidding Endpoints

### 📋 Get Item Bids

#### `GET /bids/:itemId`

**Headers:**

```
Content-Type: application/json
```

**Path Parameters:**

```
itemId: number (required) - Item ID
```

**Query Parameters:**

```
page: number (optional, default: 1)
limit: number (optional, default: 10, max: 50)
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bids retrieved successfully",
  "data": {
    "bids": [
      {
        "id": 16,
        "amount": "6000000.00",
        "userId": 6,
        "itemId": 1,
        "createdAt": "2025-07-30T20:03:41.487Z",
        "user": {
          "id": 6,
          "username": "collector_pro"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "highestBid": {
      "amount": "6000000.00",
      "user": "collector_pro",
      "timestamp": "2025-07-30T20:03:41.487Z"
    }
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "Item not found"
}
```

**Status Codes:**

- `200 OK` - Bids retrieved successfully
- `404 Not Found` - Item not found
- `500 Internal Server Error` - Server error

### 💵 Place Bid (Protected)

#### `POST /bids`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**

```json
{
  "itemId": 1,
  "amount": 6500000
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Bid placed successfully",
  "data": {
    "bid": {
      "id": 17,
      "amount": "6500000.00",
      "userId": 1,
      "itemId": 1,
      "createdAt": "2025-07-30T20:25:00.000Z",
      "user": {
        "id": 1,
        "username": "john_doe"
      }
    },
    "item": {
      "id": 1,
      "name": "Vintage Leica M3 Camera (1955)",
      "currentPrice": "6500000.00",
      "bidCount": 6
    }
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing fields
{
  "success": false,
  "message": "Item ID and bid amount are required"
}

// 400 Bad Request - Invalid bid amount
{
  "success": false,
  "message": "Bid amount must be higher than current price"
}

// 400 Bad Request - Auction ended
{
  "success": false,
  "message": "Auction has ended"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Access token required"
}

// 404 Not Found
{
  "success": false,
  "message": "Item not found"
}
```

**Status Codes:**

- `201 Created` - Bid placed successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - No token or invalid token
- `404 Not Found` - Item not found
- `500 Internal Server Error` - Server error

---

## 🤖 AI Endpoints (Powered by Gemini 1.5 Flash)

### 🧠 AI Analysis - Why Worth It

#### `POST /ai/why-worth-it`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "itemId": 1
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "AI analysis completed",
  "data": {
    "itemId": 1,
    "analysis": "Alright bidders, let's examine this 1955 Leica M3! This isn't just a camera; it's a piece of photographic history, and here's why it's worth considering a bid:\n\n**Investment Potential & Market Value:** Leica M3s, especially those in excellent condition, hold their value incredibly well. The starting price of Rp 5,000,000 is *very* attractive...",
    "confidence": 92,
    "factors": [
      "Rarity factor",
      "Condition assessment",
      "Market demand",
      "Historical significance",
      "Investment potential"
    ],
    "methodology": "Analysis based on market data, historical trends, and collectibles expertise",
    "generatedAt": "2025-07-30T20:18:52.113Z",
    "poweredBy": "Google Gemini 1.5 Flash"
  }
}
```

**Error Responses:**

```json
// 400 Bad Request
{
  "success": false,
  "message": "Item ID is required"
}

// 404 Not Found
{
  "success": false,
  "message": "Item not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Failed to generate AI analysis"
}
```

**Status Codes:**

- `200 OK` - Analysis completed successfully
- `400 Bad Request` - Missing item ID
- `404 Not Found` - Item not found
- `500 Internal Server Error` - AI service error

### 📈 AI Price Prediction

#### `POST /ai/price-prediction`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "itemId": 1
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Price prediction completed",
  "data": {
    "itemId": 1,
    "predictions": {
      "nextHour": 6457584,
      "next24Hours": 8019813,
      "estimatedFinalPrice": 6202891
    },
    "analysis": "Based on current bidding patterns and market dynamics...",
    "confidence": 81,
    "factors": [
      "Bidding velocity analysis",
      "Historical auction patterns",
      "Market demand indicators",
      "Time-to-close dynamics",
      "Category-specific trends"
    ],
    "methodology": "AI-powered analysis of auction dynamics and market patterns",
    "disclaimer": "This is an AI prediction and should not be considered as financial advice.",
    "generatedAt": "2025-07-30T20:19:56.545Z",
    "poweredBy": "Google Gemini 1.5 Flash"
  }
}
```

**Error Responses:**

```json
// 400 Bad Request
{
  "success": false,
  "message": "Item ID is required"
}

// 404 Not Found
{
  "success": false,
  "message": "Item not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Failed to generate price prediction"
}
```

**Status Codes:**

- `200 OK` - Prediction completed successfully
- `400 Bad Request` - Missing item ID
- `404 Not Found` - Item not found
- `500 Internal Server Error` - AI service error

### 🎯 AI Bidding Strategy

#### `POST /ai/bidding-strategy`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "itemId": 1,
  "userBudget": 10000000,
  "bidHistory": [
    {
      "amount": 1000000,
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "amount": 1200000,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Bidding strategy generated",
  "data": {
    "itemId": 1,
    "strategy": {
      "name": "Conservative Sniper Strategy",
      "description": "Based on your budget positioning and auction dynamics...",
      "riskLevel": "Low",
      "recommendedTiming": "Final 30 minutes - sniper strategy",
      "budgetUtilization": "60.0%"
    },
    "analysis": "Given your budget of Rp 10,000,000 versus the current price...",
    "budgetAnalysis": {
      "budget": 10000000,
      "currentPrice": 6000000,
      "budgetMultiplier": "1.67",
      "riskLevel": "Low"
    },
    "tips": [
      "Set a maximum bid limit and stick to it to avoid emotional overspending",
      "Monitor other bidders' patterns to understand competition level",
      "You have budget flexibility - consider strategic early positioning"
    ],
    "methodology": "Strategy based on auction psychology, market analysis, and budget optimization",
    "disclaimer": "This is an AI-generated strategy and should be used as guidance only.",
    "generatedAt": "2025-07-30T20:23:11.368Z",
    "poweredBy": "Google Gemini 1.5 Flash"
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Missing required fields
{
  "success": false,
  "message": "Item ID and budget are required"
}

// 400 Bad Request - Invalid budget
{
  "success": false,
  "message": "Budget must be a positive number"
}

// 404 Not Found
{
  "success": false,
  "message": "Item not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Failed to generate bidding strategy"
}
```

**Status Codes:**

- `200 OK` - Strategy generated successfully
- `400 Bad Request` - Missing fields or validation error
- `404 Not Found` - Item not found
- `500 Internal Server Error` - AI service error

---

## ⚡ WebSocket Events (Socket.IO)

### Connection

```javascript
const socket = io("http://localhost:3001", {
  auth: {
    token: "your_jwt_token", // Required for authenticated events
  },
});
```

### 📡 Client Events (Emit)

#### Join Item Room

```javascript
socket.emit("join-item", {
  itemId: 1,
});
```

#### Place Bid (Authenticated)

```javascript
socket.emit("place-bid", {
  itemId: 1,
  amount: 6500000,
});
```

### 📨 Server Events (Listen)

#### New Bid Update

```javascript
socket.on("new-bid", (data) => {
  console.log("New bid received:", data);
  // data = {
  //   bid: { id, amount, userId, itemId, createdAt, user: { username } },
  //   item: { currentPrice, bidCount },
  //   message: "New bid placed!"
  // }
});
```

#### Bid Error

```javascript
socket.on("bid-error", (error) => {
  console.log("Bid error:", error);
  // error = { message: "Error description" }
});
```

#### Connection Events

```javascript
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

---

## 🚨 Error Responses

### Standard Error Format

All API errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (development only)",
  "timestamp": "2025-07-30T20:25:00.000Z"
}
```

### HTTP Status Codes Used

| Code                        | Description                                   |
| --------------------------- | --------------------------------------------- |
| `200 OK`                    | Request successful                            |
| `201 Created`               | Resource created successfully                 |
| `400 Bad Request`           | Invalid request data                          |
| `401 Unauthorized`          | Authentication required or failed             |
| `403 Forbidden`             | Access denied                                 |
| `404 Not Found`             | Resource not found                            |
| `409 Conflict`              | Resource conflict (e.g., user already exists) |
| `422 Unprocessable Entity`  | Validation error                              |
| `500 Internal Server Error` | Server error                                  |
| `503 Service Unavailable`   | External service (AI) temporarily unavailable |

---

## 📋 Rate Limiting

- **General API**: 100 requests per minute per IP
- **AI Endpoints**: 20 requests per minute per IP
- **Authentication**: 10 requests per minute per IP

---

## 🛠️ Development Notes

### Environment Variables Required

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artify_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret
SOCKET_CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup

```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

### Start Server

```bash
npm start
# or for development
npm run dev
```

---

## 📞 Support

For API support or questions:

- **GitHub**: [Artify Repository]
- **Email**: support@artify.com
- **Docs Version**: 1.0.0
- **Last Updated**: July 30, 2025
