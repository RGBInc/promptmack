"use client";

import { MessageSquare, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export const VisualModeToggle = () => {
  const [mode, setMode] = useState<'bubble' | 'mechanical'>('bubble');

  useEffect(() => {
    setMode(localStorage.getItem('chatVisualMode') as 'bubble' | 'mechanical' || 'bubble');
  }, []);

  const toggleMode = () => {
    const next = mode === 'bubble' ? 'mechanical' : 'bubble';
    localStorage.setItem('chatVisualMode', next);
    setMode(next);
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative"
      onClick={toggleMode}
    >
      <MessageSquare 
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-200 ${
          mode === 'bubble' 
            ? 'scale-100 rotate-0 opacity-100' 
            : 'scale-0 rotate-90 opacity-0'
        }`} 
      />
      <Terminal 
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-200 ${
          mode === 'mechanical' 
            ? 'scale-100 rotate-0 opacity-100' 
            : 'scale-0 -rotate-90 opacity-0'
        }`} 
      />
      <span className="sr-only">
        Switch to {mode === 'bubble' ? 'mechanical' : 'bubble'} mode
      </span>
    </Button>
  );
};
