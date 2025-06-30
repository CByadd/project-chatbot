import React, { useState } from 'react';
import SimpleAxiosTest from './SimpleAxiosTest';
import * as Icons from 'lucide-react';

const SimpleAxiosDemo = () => {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold">Axios Connection Demo</h1>
            <button
              onClick={() => setShowDemo(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <Icons.ArrowLeft className="mr-2" size={16} />
              Back to App
            </button>
          </div>
        </div>
        <div className="py-8">
          <SimpleAxiosTest />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setShowDemo(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-lg"
      >
        <Icons.Zap className="mr-2" size={16} />
        Test Axios
      </button>
    </div>
  );
};

export default SimpleAxiosDemo;