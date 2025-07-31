# 🎨 Artify Frontend

Modern React frontend for the Artify auction platform with real-time bidding capabilities and AI-powered insights.

## ✨ Features

- 🎯 **Modern UI/UX** - Clean, responsive design with TailwindCSS
- ⚡ **Real-time Bidding** - Live auction updates via Socket.IO
- 🤖 **AI Integration** - Smart analysis and bidding strategies
- 🔐 **Authentication** - Secure JWT-based user system
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **Fast Performance** - Built with Vite for optimal speed

## 🏗️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS + Custom Components
- **State Management**: Context API + useReducer
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Icons**: Heroicons + Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend server running (see ../server)

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your backend URLs

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run clean      # Clean install dependencies
```

## 🌐 Environment Variables

```env
# Backend API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001

# Production URLs (update for deployment)
# VITE_API_URL=https://your-backend-domain.com/api
# VITE_SOCKET_URL=https://your-backend-domain.com
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   └── Loading.jsx     # Loading components
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Authentication
│   ├── Register.jsx    # User registration
│   ├── Items.jsx       # Browse items (coming soon)
│   └── ItemDetail.jsx  # Item detail page (coming soon)
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication state
├── services/           # API service layers
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API
│   ├── itemsService.js # Items API
│   ├── bidsService.js  # Bidding API
│   ├── aiService.js    # AI features API
│   └── socketService.js # Socket.IO client
├── hooks/              # Custom React hooks
│   ├── useSocket.js    # Socket connection
│   └── useCountdown.js # Timer functionality
├── utils/              # Utility functions
│   └── helpers.js      # Date, currency, validation helpers
├── App.jsx             # Main app component
└── main.jsx           # React entry point
```

## 🔌 API Integration

### Authentication

- Login/Register with JWT tokens
- Automatic token refresh
- Protected route handling

### Real-time Features

- Socket.IO connection management
- Live bid updates
- Auction room management
- Connection state handling

### AI Services

- Item value analysis
- Price predictions
- Bidding strategy recommendations

## 🎨 UI Components

### Custom CSS Classes

```css
.btn-primary
  #
  Primary
  action
  buttons
  .btn-secondary
  #
  Secondary
  buttons
  .btn-accent
  #
  Accent/CTA
  buttons
  .card
  #
  Standard
  card
  layout
  .input-field
  #
  Form
  input
  styling
  .bid-pulse
  #
  Animated
  bid
  highlighting;
```

## 🔧 Development

### Component Structure

```jsx
// Standard component pattern
import React, { useState, useEffect } from "react";
import { componentService } from "../services/componentService";
import { LoadingSpinner } from "../components/Loading";

const ComponentName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data logic
  }, []);

  return (
    <div className="component-container">
      {loading ? <LoadingSpinner /> : <Content data={data} />}
    </div>
  );
};

export default ComponentName;
```

## 🔒 Authentication Flow

1. **Login/Register** → JWT token stored in localStorage
2. **API Requests** → Token automatically added to headers
3. **Socket Connection** → Token used for authentication
4. **Route Protection** → Redirects based on auth state
5. **Token Expiry** → Automatic logout and redirect

## 📱 Responsive Design

- **Mobile-first** approach with TailwindCSS
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** UI elements
- **Adaptive** navigation for mobile

## 🚀 Performance

- **Code Splitting** with React.lazy
- **Image Optimization** with placeholder loading
- **Bundle Analysis** available via build tools
- **Caching Strategy** for API responses

## 🔮 Coming Soon

### Pages in Development

- **Browse Items** - Search and filter auctions
- **Item Details** - Detailed view with bidding
- **Create Listing** - Sell your artworks
- **Profile** - User account management
- **My Bids** - Bidding history
- **My Items** - Seller dashboard

### Features Planned

- **Advanced Search** with filters
- **Watchlist** functionality
- **Notifications** system
- **Payment Integration**
- **Mobile App** (React Native)

## 📊 Current Status

- ✅ **Project Setup**: Complete
- ✅ **Authentication**: Functional
- ✅ **UI Framework**: Complete
- ✅ **API Integration**: Complete
- ✅ **Socket.IO**: Ready
- ⏳ **Core Pages**: In Development
- ⏳ **Advanced Features**: Planned

---

**Version**: 1.0.0-beta
**License**: ISC
**Last Updated**: July 31, 2025
