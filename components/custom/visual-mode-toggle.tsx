"use client";

// Third-party imports
import { MessageSquare, Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";

// Local imports
import { useVisualMode } from "./visual-mode-context";
import { Button } from "../ui/button";

interface VisualModeToggleProps {
  onChange?: (mode: 'bubble' | 'mechanical') => void;
}

export const VisualModeToggle = ({ onChange }: VisualModeToggleProps) => {
  const [mounted, setMounted] = useState(false);
  const { mode, toggleMode: contextToggleMode } = useVisualMode();

  useEffect(() => {
    setMounted(true);
    onChange?.(mode);
  }, [onChange, mode]);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    const nextMode = mode === 'bubble' ? 'mechanical' : 'bubble';
    contextToggleMode();
    onChange?.(nextMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 relative"
      onClick={handleToggle}
    >
      <MessageSquare
        className={`size-[1.2rem] absolute transition-all duration-500 ${
          mode === 'bubble'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0'
        }`}
      />
      <Terminal
        className={`size-[1.2rem] absolute transition-all duration-500 ${
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
