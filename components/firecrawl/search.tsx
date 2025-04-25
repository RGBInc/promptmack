"use client";

import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import React, { useState } from "react";

import { Markdown } from "../custom/markdown";

interface SearchResult {
  title: string;
  url: string;
  description?: string;
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    sourceURL?: string;
    language?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface SearchData {
  query?: string;
  results?: SearchResult[];
  error?: string;
  message?: string;
}

interface SearchProps {
  searchData?: SearchData;
}

export const FirecrawlSearch = ({ searchData }: SearchProps) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  
  if (!searchData) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2 mb-3">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Handle error
  if (searchData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200">
        <p className="font-medium">Error performing search:</p>
        <p>{searchData.error}</p>
      </div>
    );
  }

  // Handle message
  if (searchData.message) {
    return (
      <div className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Search size={16} className="text-blue-500 animate-pulse" />
          <h3 className="font-medium">Search in Progress</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {searchData.message}
        </p>
      </div>
    );
  }

  // Check if we have valid results
  if (!searchData.results || searchData.results.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-4">
        <p>No search results found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 overflow-hidden"
      >
        <div className="mb-3 flex justify-between items-center">
          <h3 className="font-medium">
            {searchData.query ? (
              <>
                Search Results for <span className="text-blue-600 dark:text-blue-400">{searchData.query}</span>
              </>
            ) : (
              "Search Results"
            )}
          </h3>
          <span className="text-sm text-zinc-500">
            {searchData.results.length} results
          </span>
        </div>
        
        <div className="space-y-4">
          {searchData.results.map((result, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-zinc-200 dark:border-zinc-700 rounded-md p-3 transition-all hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium">
                    {result.title || result.metadata?.title || 'Untitled'}
                  </h4>
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1"
                  >
                    {result.url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                    <ExternalLink size={12} />
                  </a>
                </div>
                {(result.markdown || result.html) && (
                  <button
                    className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                  >
                    {expandedItem === index ? 'Hide' : 'View'}
                  </button>
                )}
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                {result.description || result.metadata?.description || 'No description available.'}
              </p>
              
              {expandedItem === index && result.markdown && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700"
                >
                  <div className="prose dark:prose-invert prose-sm max-h-96 overflow-y-auto">
                    <Markdown>{result.markdown}</Markdown>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 