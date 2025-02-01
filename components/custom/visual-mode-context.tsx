"use client";

import { createContext, useContext, useEffect, useState } from "react";

type VisualMode = 'bubble' | 'mechanical';

interface VisualModeContextType {
  mode: VisualMode;
  toggleMode: () => void;
}

const VisualModeContext = createContext<VisualModeContextType | undefined>(undefined);

export function VisualModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<VisualMode>('bubble');

  useEffect(() => {
    const savedMode = localStorage.getItem('chatVisualMode') as VisualMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const next = mode === 'bubble' ? 'mechanical' : 'bubble';
    localStorage.setItem('chatVisualMode', next);
    setMode(next);
  };

  return (
    <VisualModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </VisualModeContext.Provider>
  );
}

export function useVisualMode() {
  const context = useContext(VisualModeContext);
  if (context === undefined) {
    throw new Error('useVisualMode must be used within a VisualModeProvider');
  }
  return context;
}