"use client";

import { MessageSquare, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface VisualModeToggleProps {
  onChange?: (mode: 'bubble' | 'mechanical') => void;
}

export const VisualModeToggle = ({ onChange }: VisualModeToggleProps) => {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'bubble' | 'mechanical'>('bubble');

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('chatVisualMode') as 'bubble' | 'mechanical';
    if (savedMode) {
      setMode(savedMode);
      onChange?.(savedMode);
    }
  }, [onChange]);

  if (!mounted) {
    return null;
  }

  const toggleMode = () => {
    const next = mode === 'bubble' ? 'mechanical' : 'bubble';
    localStorage.setItem('chatVisualMode', next);
    setMode(next);
    onChange?.(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative"
      onClick={toggleMode}
    >
      <MessageSquare
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-500 ${
          mode === 'bubble'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0'
        }`}
      />
      <Terminal
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-500 ${
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
