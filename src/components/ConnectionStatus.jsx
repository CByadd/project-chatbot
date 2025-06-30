import React from 'react';
import * as Icons from 'lucide-react';

const ConnectionStatus = ({ connectionStatus }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
        connectionStatus === 'connected' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : connectionStatus === 'disconnected'
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' 
            ? 'bg-green-500' 
            : connectionStatus === 'disconnected'
            ? 'bg-red-500'
            : 'bg-yellow-500'
        }`} />
        <span>
          {connectionStatus === 'connected' ? 'API Connected' : 
           connectionStatus === 'disconnected' ? 'API Offline' : 'Connecting...'}
        </span>
      </div>
    </div>
  );
};

export default ConnectionStatus;