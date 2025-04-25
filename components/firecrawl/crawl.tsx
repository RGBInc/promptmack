"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import React, { useState } from "react";

import { Markdown } from "../custom/markdown";

interface CrawlItem {
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    sourceURL?: string;
    language?: string;
    statusCode?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface CrawlData {
  status?: string;
  total?: number;
  completed?: number;
  creditsUsed?: number;
  expiresAt?: string;
  next?: string;
  data?: CrawlItem[];
  error?: string;
  message?: string;
}

interface CrawlProps {
  crawlData?: CrawlData;
}

export const FirecrawlCrawl = ({ crawlData }: CrawlProps) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  
  if (!crawlData) {
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

  // Handle pending status
  if (crawlData.status === 'pending' || crawlData.message) {
    return (
      <div className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-blue-500 animate-pulse" />
          <h3 className="font-medium">Crawl in Progress</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {crawlData.message || "The website crawl is still in progress. Results will be available soon."}
        </p>
        {crawlData.total && crawlData.completed && (
          <div className="mt-2">
            <div className="relative w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${(crawlData.completed / crawlData.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {crawlData.completed} of {crawlData.total} pages ({Math.round((crawlData.completed / crawlData.total) * 100)}%)
            </p>
          </div>
        )}
      </div>
    );
  }

  // Handle error
  if (crawlData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200">
        <p className="font-medium">Error crawling website:</p>
        <p>{crawlData.error}</p>
      </div>
    );
  }

  // Handle completed crawl with data
  if (crawlData.data && crawlData.data.length > 0) {
    return (
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 overflow-hidden"
        >
          <div className="mb-3 flex justify-between items-center">
            <h3 className="font-medium">Crawl Results</h3>
            <span className="text-sm text-zinc-500">
              {crawlData.data.length} pages
            </span>
          </div>
          
          <div className="space-y-3">
            {crawlData.data.slice(0, 10).map((item, index) => (
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
                      {item.metadata?.title || 'Untitled Page'}
                    </h4>
                    {item.metadata?.sourceURL && (
                      <a 
                        href={item.metadata.sourceURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1"
                      >
                        {item.metadata.sourceURL.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <button
                    className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                    onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                  >
                    {expandedItem === index ? 'Hide' : 'View'}
                  </button>
                </div>
                
                {expandedItem === index && item.markdown && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700"
                  >
                    <div className="prose dark:prose-invert prose-sm max-h-96 overflow-y-auto">
                      <Markdown>{item.markdown}</Markdown>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          {crawlData.data.length > 10 && (
            <p className="text-sm text-zinc-500 mt-3">
              + {crawlData.data.length - 10} more pages crawled (showing first 10)
            </p>
          )}
          
          {crawlData.creditsUsed && (
            <p className="text-xs text-zinc-500 mt-3">
              Credits used: {crawlData.creditsUsed}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // Fallback when no data is available
  return (
    <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-4">
      <p>No results returned from the crawl operation.</p>
    </div>
  );
}; 