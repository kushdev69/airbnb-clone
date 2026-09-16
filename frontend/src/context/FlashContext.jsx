import { createContext, useContext, useState, useCallback } from 'react';

const FlashContext = createContext(null);

export function FlashProvider({ children }) {
  const [flashes, setFlashes] = useState({ success: [], error: [] });

  const addFlash = useCallback((type, message) => {
    setFlashes(prev => ({
      ...prev,
      [type]: [...prev[type], message]
    }));
  }, []);

  const clearFlashes = useCallback((type) => {
    setFlashes(prev => ({
      ...prev,
      [type]: []
    }));
  }, []);

  const clearAllFlashes = useCallback(() => {
    setFlashes({ success: [], error: [] });
  }, []);

  const value = {
    flashes,
    addFlash,
    clearFlashes,
    clearAllFlashes,
  };

  return (
    <FlashContext.Provider value={value}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
}