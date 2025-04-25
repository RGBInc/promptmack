'use client';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TokenCounterProps {
  used: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function TokenCounter({
  used,
  total,
  size = 'md',
  showLabel = true,
  className,
}: TokenCounterProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const percentage = Math.min(100, (used / total) * 100);
  
  // Set size based on prop
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }[size];
  
  // Set text size based on counter size
  const textClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 50) return 'hsl(var(--chart-2))';
    if (percentage < 80) return 'hsl(var(--chart-4))';
    return 'hsl(var(--chart-1))';
  };

  if (!mounted) {
    return <div className={cn(sizeClass, className)} />;
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={sizeClass}>
        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          strokeWidth={10}
          styles={buildStyles({
            strokeLinecap: 'round',
            textSize: '24px',
            pathTransitionDuration: 0.5,
            pathColor: getColor(),
            textColor: theme === 'dark' ? 'white' : 'black',
            trailColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          })}
        />
      </div>
      {showLabel && (
        <div className={cn('mt-2 flex flex-col items-center', textClass)}>
          <span className="font-medium">{used.toLocaleString()} / {total.toLocaleString()}</span>
          <span className="text-muted-foreground">tokens</span>
        </div>
      )}
    </div>
  );
}