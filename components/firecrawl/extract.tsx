"use client";

import { motion } from "framer-motion";
import { ExternalLink, Database } from "lucide-react";
import React, { useState } from "react";

interface ExtractItem {
  [key: string]: unknown;
}

interface ExtractData {
  id?: string;
  status?: string;
  prompt?: string;
  urls?: string[];
  data?: ExtractItem[] | ExtractItem; // Could be single object or array
  error?: string;
  message?: string;
}

interface ExtractProps {
  extractData?: ExtractData;
}

export const FirecrawlExtract = ({ extractData }: ExtractProps) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  
  if (!extractData) {
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
  if (extractData.status === 'pending' || extractData.message) {
    return (
      <div className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2 mb-2">
          <Database size={16} className="text-blue-500 animate-pulse" />
          <h3 className="font-medium">Data Extraction in Progress</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {extractData.message || "Extracting structured data from the provided URLs. Results will be available soon."}
        </p>
      </div>
    );
  }

  // Handle error
  if (extractData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200">
        <p className="font-medium">Error extracting data:</p>
        <p>{extractData.error}</p>
      </div>
    );
  }

  // Check if we have valid data
  if (!extractData.data) {
    return (
      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-4">
        <p>No extracted data available.</p>
      </div>
    );
  }

  // Convert single object to array if necessary
  const dataItems = Array.isArray(extractData.data) 
    ? extractData.data 
    : [extractData.data];

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all overflow-hidden"
      >
        <div className="mb-3 flex justify-between items-center">
          <h3 className="font-medium">Extracted Data</h3>
          <span className="text-sm text-zinc-500">
            {dataItems.length} items
          </span>
        </div>
        
        {extractData.prompt && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">Extraction prompt: </span>
            {extractData.prompt}
          </div>
        )}
        
        {extractData.urls && extractData.urls.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Data sources:</p>
            <div className="flex flex-wrap gap-2">
              {extractData.urls.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full"
                >
                  {url.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {dataItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-zinc-200 dark:border-zinc-700 rounded-md p-3 transition-all hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
            >
              <div className="flex justify-between items-start mb-2 gap-3">
                <div className="font-medium min-w-0 flex-1">Item {index + 1}</div>
                <button
                  className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors shrink-0 whitespace-nowrap"
                  onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                >
                  {expandedItem === index ? 'Hide' : 'View'}
                </button>
              </div>
              
              {expandedItem === index && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2"
                >
                  <pre className="text-xs whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800 p-2 rounded-md overflow-x-auto">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};