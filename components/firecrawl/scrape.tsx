"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from 'next/image';
import React from "react";

import { Markdown } from "../custom/markdown";

interface ScrapeData {
  success?: boolean;
  data?: {
    markdown?: string;
    html?: string;
    links?: string[];
    metadata?: {
      title?: string;
      description?: string;
      sourceURL?: string;
      language?: string;
      [key: string]: unknown;
    };
    screenshot?: string;
    [key: string]: unknown;
  };
  error?: string;
}

interface ScrapeProps {
  scrapeData?: ScrapeData;
}

export const FirecrawlScrape = ({ scrapeData }: ScrapeProps) => {
  if (!scrapeData) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="flex gap-3 items-center">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="size-5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-2" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 mb-2" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 mb-2" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
      </div>
    );
  }

  if (scrapeData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200">
        <p className="font-medium">Error scraping content:</p>
        <p>{scrapeData.error}</p>
      </div>
    );
  }

  const data = scrapeData.data;
  if (!data) {
    return (
      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-4">
        <p>No data returned from the scrape operation.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all overflow-hidden"
      >
        {/* Header with title and source URL */}
        {data.metadata?.title && (
          <div className="mb-3">
            <h2 className="text-xl font-semibold">
              {data.metadata.title}
            </h2>
          </div>
        )}
        
        {data.metadata?.sourceURL && (
          <div className="mb-4 flex items-center">
            <a 
              href={data.metadata.sourceURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1"
            >
              {data.metadata.sourceURL.replace(/^https?:\/\//, '').replace(/^www\./, '')}
              <ExternalLink size={14} />
            </a>
          </div>
        )}
        
        {/* Screenshot if available */}
        {data.screenshot && (
          <div className="mb-4 rounded-md overflow-hidden border dark:border-zinc-700">
            <Image 
              src={data.screenshot} 
              alt={data.metadata?.title || "Screenshot of the page"}
              width={700}
              height={400}
              className="w-full h-auto"
            />
          </div>
        )}
        
        {/* Metadata highlights */}
        {data.metadata && (
          <div className="mb-4 text-sm grid grid-cols-2 gap-2">
            {data.metadata.language && (
              <div>
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Language:</span> {data.metadata.language}
              </div>
            )}
            {data.metadata.description && (
              <div className="col-span-2">
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Description:</span> {data.metadata.description}
              </div>
            )}
          </div>
        )}
        
        {/* Main content */}
        {data.markdown && (
          <div className="prose dark:prose-invert prose-sm max-w-none mb-4">
            <Markdown>{data.markdown}</Markdown>
          </div>
        )}
        
        {/* Links */}
        {data.links && data.links.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Page Links:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 overflow-hidden">
              {data.links.slice(0, 10).map((link, index) => (
                <a 
                  key={index}
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline truncate flex items-center gap-1"
                >
                  {link.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
            {data.links.length > 10 && (
              <p className="text-sm text-zinc-500 mt-1">
                + {data.links.length - 10} more links
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}; 