import React from "react";
import { showSuccess, showError, showWarning, showInfo, showConfirm, showToast } from "../utils/notifications";

const NotificationDemo = () => {
  const testSuccess = () => {
    showSuccess(
      'Account Created Successfully!',
      'Welcome to Artify. You can now start exploring artworks.',
      { timer: 3000 }
    );
  };

  const testError = () => {
    showError(
      'Payment Failed',
      'Your payment could not be processed. Please try again.',
      { confirmText: 'Try Again' }
    );
  };

  const testWarning = () => {
    showWarning(
      'Session Expiring Soon',
      'Your session will expire in 2 minutes. Please save your work.',
      { 
        confirmText: 'Extend Session',
        showCancel: true,
        cancelText: 'Logout'
      }
    );
  };

  const testInfo = () => {
    showInfo(
      'New Feature Available',
      'We\'ve added AI-powered artwork recommendations to help you discover pieces you\'ll love.',
      {
        confirmText: 'Learn More',
        showCancel: true,
        cancelText: 'Maybe Later'
      }
    );
  };

  const testConfirm = () => {
    showConfirm(
      'Delete Artwork',
      'Are you sure you want to remove this artwork from your collection? This action cannot be undone.',
      {
        confirmText: 'Yes, Delete',
        cancelText: 'Keep Artwork'
      }
    ).then((result) => {
      if (result.isConfirmed) {
        showToast('Artwork deleted successfully', 'success');
      } else {
        showToast('Artwork kept in collection', 'info');
      }
    });
  };

  const testToastSuccess = () => {
    showToast('Artwork saved to favorites', 'success');
  };

  const testToastError = () => {
    showToast('Failed to load image', 'error');
  };

  const testToastWarning = () => {
    showToast('Auction ending in 5 minutes', 'warning');
  };

  const testToastInfo = () => {
    showToast('New bid placed by collector123', 'info');
  };

  return (
    <div className="min-h-screen bg-artsy-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-artsy-black mb-4">
            Artify Notification System
          </h1>
          <p className="text-lg text-artsy-gray-700">
            Test our Artsy-inspired notification system with clean, minimal design.
          </p>
        </div>

        {/* Modal Notifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-artsy-black mb-6">
            Modal Notifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={testSuccess}
              className="px-6 py-4 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
            >
              Success Message
            </button>
            
            <button
              onClick={testError}
              className="px-6 py-4 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Error Message
            </button>
            
            <button
              onClick={testWarning}
              className="px-6 py-4 bg-yellow-600 text-white hover:bg-yellow-700 transition-colors duration-200"
            >
              Warning Message
            </button>
            
            <button
              onClick={testInfo}
              className="px-6 py-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            >
              Info Message
            </button>
            
            <button
              onClick={testConfirm}
              className="px-6 py-4 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
            >
              Confirmation Dialog
            </button>
          </div>
        </div>

        {/* Toast Notifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif text-artsy-black mb-6">
            Toast Notifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={testToastSuccess}
              className="px-6 py-4 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200"
            >
              Success Toast
            </button>
            
            <button
              onClick={testToastError}
              className="px-6 py-4 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              Error Toast
            </button>
            
            <button
              onClick={testToastWarning}
              className="px-6 py-4 border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors duration-200"
            >
              Warning Toast
            </button>
            
            <button
              onClick={testToastInfo}
              className="px-6 py-4 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Info Toast
            </button>
          </div>
        </div>

        {/* Design Guidelines */}
        <div className="bg-artsy-gray-50 p-8">
          <h2 className="text-2xl font-serif text-artsy-black mb-6">
            Design Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-artsy-black mb-3">
                Visual Design
              </h3>
              <ul className="text-artsy-gray-700 space-y-2 text-sm">
                <li>• Clean, minimal aesthetic matching Artsy.net</li>
                <li>• Sharp edges, no rounded corners</li>
                <li>• Subtle animations with animate.css</li>
                <li>• Consistent black/white color scheme</li>
                <li>• Elegant serif typography for titles</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-artsy-black mb-3">
                User Experience
              </h3>
              <ul className="text-artsy-gray-700 space-y-2 text-sm">
                <li>• Toast notifications for quick feedback</li>
                <li>• Modal dialogs for important actions</li>
                <li>• Auto-dismiss timers where appropriate</li>
                <li>• Clear action buttons with consistent styling</li>
                <li>• Progress indicators for time-sensitive alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
