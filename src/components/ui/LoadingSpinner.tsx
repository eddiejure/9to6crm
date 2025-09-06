import React from 'react';
import { Building2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 animate-pulse">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">9to6</h2>
        <p className="text-gray-600">Wird geladen...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;