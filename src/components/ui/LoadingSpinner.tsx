import React from 'react';
import { Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoadingSpinner: React.FC = () => {
  const { debugInfo } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 animate-pulse">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">9to6</h2>
        <p className="text-gray-600">{debugInfo || 'Wird geladen...'}</p>
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
          <p className="text-xs text-gray-500">Debug Info:</p>
          <p className="text-sm text-gray-700 font-mono">{debugInfo}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Force Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;