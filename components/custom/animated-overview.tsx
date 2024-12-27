"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
export const AnimatedOverview = () => {
  const { theme } = useTheme();
  const [quote, setQuote] = useState("Every sufficiently advanced technology is indistinguishable from magic.");

  useEffect(() => {
  }, []);

  return (
    <motion.div
      className="relative w-full h-[400px] overflow-hidden rounded-3xl rounded-b-xl bg-white dark:bg-background flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Central content */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="relative"
          animate={{
            transform: ['scale(1) rotate(0deg)', 'scale(1.05) rotate(3deg)', 'scale(1) rotate(-3deg)', 'scale(1) rotate(0deg)']
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Robot SVG */}
          <motion.img
            src="/images/promptmack-logo.svg"
            alt="Robot"
            className="w-20 h-20"
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
