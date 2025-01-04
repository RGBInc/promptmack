"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function AnimatedLogo() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    // Initial delay of 2 minutes before first animation
    const initialDelay = setTimeout(() => {
      setIsCollapsed(true);
    }, 120000); // 2 minutes in milliseconds

    // Then set up the interval for subsequent animations
    const interval = setInterval(() => {
      setIsCollapsed(prev => !prev);
    }, 120000); // 2 minutes in milliseconds
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center h-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.div
            key="collapsed"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center"
          >
            <span className="font-light">p</span>
            <span className="font-medium">m</span>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center"
          >
            <span className="font-light">Prompt</span>
            <span className="font-medium">mack</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
