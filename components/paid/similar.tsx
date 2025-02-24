"use client";

import { motion } from "framer-motion";
import Image from 'next/image'
import React from "react";

interface SimilarResult {
  score: number;
  title: string;
  id: string;
  url: string;
  publishedDate: string;
  author: string | null;
  summary: string;
  image?: string;
  favicon?: string;
  highlights: string[];
  highlightScores: number[];
}

interface SimilarProps {
  similarData?: {
    results: SimilarResult[];
    requestId: string;
  };
}

export const Similar = ({ similarData }: SimilarProps) => {
  if (!similarData) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              </div>
              <div className="size-6 bg-zinc-200 dark:bg-zinc-800 rounded shrink-0" />
            </div>
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {similarData.results.map((result, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group flex flex-col gap-3 p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all duration-200 max-w-full"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="shrink-0 px-2 py-1 bg-blue-500/10 dark:bg-blue-400/10 rounded text-xs font-medium text-blue-600 dark:text-blue-400">
              {Math.round(result.score * 100)}% match
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-zinc-900 dark:text-zinc-100 hover:underline break-words"
            >
              {new URL(result.url).hostname}
            </a>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 break-words">
              {result.title}
            </p>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 break-words">
            {result.summary}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            {result.publishedDate && (
              <span>{new Date(result.publishedDate).toLocaleDateString()}</span>
            )}
            {result.favicon && (
              <div className="ml-auto">
                <Image
                  src={result.favicon}
                  alt={result.title}
                  width={24}
                  height={24}
                  className="size-6"
                />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
