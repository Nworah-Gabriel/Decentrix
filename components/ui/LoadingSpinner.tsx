import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-400 rounded-full animate-ping mx-auto"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800"></h2>
        </div>

        {/* Optional: Network Status */}
        {/* <div className="mt-8 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected to Sui Testnet</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoadingSpinner;
