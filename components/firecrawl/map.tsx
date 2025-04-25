"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderTree } from "lucide-react";
import React from "react";

interface MapNode {
  id: string;
  url: string;
  name?: string;
  group?: number;
  level?: number;
  val?: number;
}

interface MapLink {
  source: string;
  target: string;
  value?: number;
}

interface MapData {
  nodes?: MapNode[];
  links?: MapLink[] | string[];  // Allow either structured links or raw string array
  error?: string;
  message?: string;
  total?: number;
}

interface MapProps {
  mapData?: MapData;
}

export const FirecrawlMap = ({ mapData }: MapProps) => {
  if (!mapData) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-4" />
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
      </div>
    );
  }

  // Handle error
  if (mapData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-200">
        <p className="font-medium">Error mapping website:</p>
        <p>{mapData.error}</p>
      </div>
    );
  }

  // Handle message (usually for in-progress maps)
  if (mapData.message) {
    return (
      <div className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30">
        <div className="flex items-center gap-2 mb-2">
          <FolderTree size={16} className="text-blue-500 animate-pulse" />
          <h3 className="font-medium">Mapping in Progress</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {mapData.message}
        </p>
      </div>
    );
  }

  // Handle raw links array if that's what we received
  if (Array.isArray(mapData.links) && (!mapData.nodes || mapData.nodes.length === 0)) {
    // Check if links contains string URLs by checking the first item
    if (mapData.links.length > 0 && typeof mapData.links[0] === 'string') {
      // Safe to cast since we checked the type
      const stringLinks = mapData.links as string[];
      
      return (
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30"
          >
            <div className="mb-3 flex justify-between items-center">
              <h3 className="font-medium">Site Map</h3>
              <span className="text-sm text-zinc-500">
                {stringLinks.length} URLs found
              </span>
            </div>
            
            <div className="mt-4 space-y-1 max-h-96 overflow-y-auto">
              {stringLinks.map((url, idx) => (
                <div key={idx} className="text-sm flex items-center gap-2 p-1.5 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded">
                  <div className="size-1.5 rounded-full shrink-0 bg-blue-500"></div>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
                  >
                    {url.replace(/^https?:\/\//, '')}
                    <ExternalLink size={10} className="shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      );
    }
  }

  // Check if we have valid node data
  if (!mapData.nodes || mapData.nodes.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-4">
        <p>No site map data available. Try mapping a different URL.</p>
      </div>
    );
  }

  // Group nodes by level/depth for better organization
  const nodesByLevel = mapData.nodes.reduce((groups, node) => {
    const level = node.level || 0;
    if (!groups[level]) groups[level] = [];
    groups[level].push(node);
    return groups;
  }, {} as Record<number, MapNode[]>);

  // Get all levels and sort them
  const levels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30"
      >
        <div className="mb-3 flex justify-between items-center">
          <h3 className="font-medium">Site Map</h3>
          <span className="text-sm text-zinc-500">
            {mapData.nodes.length} pages mapped
          </span>
        </div>

        {/* Visual site map representation */}
        <div className="space-y-4 mb-6">
          {levels.map(level => (
            <div key={level} className="relative">
              <div className="flex items-center mb-1">
                <div className={`size-2 rounded-full ${level === 0 ? 'bg-blue-500' : level === 1 ? 'bg-green-500' : 'bg-purple-500'} mr-2`}></div>
                <span className="text-xs font-medium">
                  {level === 0 ? 'Root' : level === 1 ? 'First Level' : `Level ${level}`} ({nodesByLevel[level].length} pages)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {nodesByLevel[level].slice(0, 9).map((node, idx) => (
                  <a 
                    key={idx}
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-2 rounded text-xs truncate flex items-center gap-1 hover:bg/80 transition-colors ${
                      level === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 
                      level === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                    }`}
                  >
                    {node.name || new URL(node.url).pathname || node.url}
                    <ExternalLink size={10} className="shrink-0" />
                  </a>
                ))}
                {nodesByLevel[level].length > 9 && (
                  <div className="px-3 py-2 rounded text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    + {nodesByLevel[level].length - 9} more pages
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Full list view */}
        <div className="mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-4">
          <h4 className="font-medium text-sm mb-2">All Pages ({mapData.nodes.length})</h4>
          <div className="max-h-96 overflow-y-auto space-y-1">
            {mapData.nodes.map((node, idx) => (
              <div key={idx} className="text-sm flex items-center gap-2 p-1.5 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded">
                <div className={`size-1.5 rounded-full shrink-0 ${
                  node.group === 1 ? 'bg-blue-500' : node.group === 2 ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <a 
                  href={node.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
                >
                  {node.url.replace(/^https?:\/\//, '')}
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 