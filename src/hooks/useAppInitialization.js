import { useEffect } from 'react';

export const useAppInitialization = () => {
  useEffect(() => {
    console.log('🚀 ConvoBox App initialized:', {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4000/api'
    });
  }, []);

  return {
    initialized: true
  };
};