import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LoadingPage } from "./components/Loading";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import NotificationDemo from "./pages/NotificationDemo";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  return !isAuthenticated ? children : <Navigate to="/items" replace />;
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* Auth Routes - Only accessible when not authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Placeholders for now */}
      <Route
        path="/items"
        element={
          <Layout>
            <Items />
          </Layout>
        }
      />

      <Route
        path="/items/:id"
        element={
          <Layout>
            <ItemDetail />
          </Layout>
        }
      />

      {/* Demo Route for Notifications */}
      <Route
        path="/demo/notifications"
        element={
          <Layout>
            <NotificationDemo />
          </Layout>
        }
      />

      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <Layout>
              <div className="min-h-screen bg-artsy-white flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto px-6">
                  <h1 className="text-3xl md:text-4xl font-serif text-artsy-black mb-4">
                    Sell with Artify
                  </h1>
                  <p className="text-artsy-gray-600 mb-8 leading-relaxed">
                    Partner with us to reach collectors worldwide. Our expert team will help you 
                    showcase your artwork to a global audience of art enthusiasts.
                  </p>
                  <div className="space-y-4">
                    <div className="p-6 border border-artsy-gray-200 text-left">
                      <h3 className="font-medium text-artsy-black mb-2">Consign with Confidence</h3>
                      <p className="text-sm text-artsy-gray-600">
                        Our specialists provide personalized guidance throughout the consignment process.
                      </p>
                    </div>
                    <div className="p-6 border border-artsy-gray-200 text-left">
                      <h3 className="font-medium text-artsy-black mb-2">Global Reach</h3>
                      <p className="text-sm text-artsy-gray-600">
                        Connect with collectors, galleries, and institutions worldwide.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button className="px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200 mr-4">
                      Submit Artwork
                    </button>
                    <button className="px-8 py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <div className="min-h-screen bg-artsy-white py-12">
                <div className="max-w-4xl mx-auto px-6">
                  <div className="border-b border-artsy-gray-200 pb-8 mb-8">
                    <h1 className="text-3xl font-serif text-artsy-black mb-4">
                      Account Settings
                    </h1>
                    <p className="text-artsy-gray-600">
                      Manage your profile, preferences, and collection.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 border border-artsy-gray-200">
                        <h3 className="font-medium text-artsy-black mb-4">Profile Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-artsy-gray-600 mb-1">Name</label>
                            <input type="text" className="w-full px-3 py-2 border border-artsy-gray-300 focus:outline-none focus:border-artsy-black" placeholder="Your Name" />
                          </div>
                          <div>
                            <label className="block text-sm text-artsy-gray-600 mb-1">Email</label>
                            <input type="email" className="w-full px-3 py-2 border border-artsy-gray-300 focus:outline-none focus:border-artsy-black" placeholder="your@email.com" />
                          </div>
                          <button className="px-6 py-2 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200">
                            Update Profile
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 border border-artsy-gray-200">
                        <h3 className="font-medium text-artsy-black mb-4">Collection Preferences</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-sm text-artsy-gray-600">Email notifications for new artworks</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-sm text-artsy-gray-600">Bidding updates</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span className="text-sm text-artsy-gray-600">Gallery recommendations</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bids"
        element={
          <ProtectedRoute>
            <Layout>
              <div className="min-h-screen bg-artsy-white py-12">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="border-b border-artsy-gray-200 pb-8 mb-8">
                    <h1 className="text-3xl font-serif text-artsy-black mb-4">
                      My Bids
                    </h1>
                    <p className="text-artsy-gray-600">
                      Track your bidding activity and auction status.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-4 border border-artsy-gray-200 text-center">
                        <div className="text-2xl font-medium text-artsy-black">0</div>
                        <div className="text-sm text-artsy-gray-600">Active Bids</div>
                      </div>
                      <div className="p-4 border border-artsy-gray-200 text-center">
                        <div className="text-2xl font-medium text-artsy-black">0</div>
                        <div className="text-sm text-artsy-gray-600">Won Auctions</div>
                      </div>
                      <div className="p-4 border border-artsy-gray-200 text-center">
                        <div className="text-2xl font-medium text-artsy-black">0</div>
                        <div className="text-sm text-artsy-gray-600">Watched Items</div>
                      </div>
                    </div>
                    
                    <div className="text-center py-16">
                      <h3 className="text-xl font-serif text-artsy-black mb-4">
                        No Bids Yet
                      </h3>
                      <p className="text-artsy-gray-600 mb-8">
                        Start building your collection by placing bids on artworks you love.
                      </p>
                      <a href="/items" className="px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200">
                        Browse Artworks
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-items"
        element={
          <ProtectedRoute>
            <Layout>
              <div className="min-h-screen bg-artsy-white py-12">
                <div className="max-w-6xl mx-auto px-6">
                  <div className="border-b border-artsy-gray-200 pb-8 mb-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-serif text-artsy-black mb-4">
                          My Artworks
                        </h1>
                        <p className="text-artsy-gray-600">
                          Manage the artworks you've consigned for sale.
                        </p>
                      </div>
                      <button className="px-6 py-2 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200">
                        Add Artwork
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-4 border border-artsy-gray-200 text-center">
                        <div className="text-2xl font-medium text-artsy-black">0</div>
                        <div className="text-sm text-artsy-gray-600">Active Listings</div>
                      </div>
                      <div className="p-4 border border-artsy-gray-200 text-center">
                        <div className="text-2xl font-medium text-artsy-black">0</div>
                        <div className="text-sm text-artsy-gray-600">Sold Items</div>
                      </div>
                      <div className="p-4 border border-artsy-gray-200 text-center">
                        <div className="text-2xl font-medium text-artsy-black">Rp 0</div>
                        <div className="text-sm text-artsy-gray-600">Total Sales</div>
                      </div>
                    </div>
                    
                    <div className="text-center py-16">
                      <h3 className="text-xl font-serif text-artsy-black mb-4">
                        No Artworks Listed
                      </h3>
                      <p className="text-artsy-gray-600 mb-8">
                        Start selling your artworks to collectors worldwide.
                      </p>
                      <div className="space-y-3">
                        <a href="/sell" className="block px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200">
                          Consign Artwork
                        </a>
                        <a href="#" className="block px-8 py-3 border border-artsy-black text-artsy-black hover:bg-artsy-black hover:text-artsy-white transition-colors duration-200">
                          Learn About Selling
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="min-h-screen bg-artsy-white flex items-center justify-center">
              <div className="text-center max-w-md mx-auto px-6">
                <h1 className="text-6xl font-serif text-artsy-black mb-6">404</h1>
                <h2 className="text-2xl font-serif text-artsy-black mb-4">Page Not Found</h2>
                <p className="text-artsy-gray-600 mb-8 leading-relaxed">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-artsy-black text-artsy-white hover:bg-artsy-gray-900 transition-colors duration-200"
                >
                  Return Home
                </a>
              </div>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
