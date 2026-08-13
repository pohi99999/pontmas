"use client";

import React, { createContext, useContext, useState } from 'react';

const SensoryContext = createContext({
  isSensoryFriendly: false,
  toggleSensoryMode: () => {},
});

export function SensoryProvider({ children }: { children: React.ReactNode }) {
  const [isSensoryFriendly, setIsSensoryFriendly] = useState(false);

  const toggleSensoryMode = () => {
    setIsSensoryFriendly(prev => !prev);
  };

  return (
    <SensoryContext.Provider value={{ isSensoryFriendly, toggleSensoryMode }}>
      <div className={isSensoryFriendly ? 'sensory-friendly' : ''}>
        {children}
      </div>
    </SensoryContext.Provider>
  );
}

export const useSensory = () => useContext(SensoryContext);
