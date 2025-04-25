"use client";

import { motion } from "framer-motion";
import { ExternalLink, Bot, Braces, Code, Laptop, Globe, RotateCw, X } from "lucide-react";
import Image from 'next/image';
import React, { useState, useEffect } from "react";

import { Markdown } from "../custom/markdown";
import { Button } from "../ui/button";

interface AgentData {
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
    agentPrompt?: string;
    agentResponse?: string;
    [key: string]: unknown;
  };
  error?: string;
  message?: string;
}

interface AgentProps {
  agentData?: AgentData;
  onStopAgent?: () => void;
}

export const FirecrawlAgent = ({ agentData, onStopAgent }: AgentProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statusMessages, setStatusMessages] = useState<string[]>([
    "Loading website...",
    "Analyzing page structure...",
    "Planning navigation...",
    "Executing steps..."
  ]);

  // Update elapsed time when agent is loading
  useEffect(() => {
    if (!agentData || agentData.message) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
    return () => {};
  }, [agentData]);

  // Rotate status messages to show different activities
  useEffect(() => {
    if (!agentData || agentData.message) {
      if (elapsedTime > 0 && elapsedTime % 12 === 0) {
        setStatusMessages(prevMessages => {
          if (elapsedTime < 24) {
            return prevMessages;
          } else if (elapsedTime < 48) {
            return [
              "Navigating to content...",
              "Processing form elements...",
              "Extracting page data...",
              "Continuing navigation..."
            ];
          } else {
            return [
              "Capturing page screenshots...",
              "Processing multi-page content...",
              "Collecting extracted data...",
              "Finalizing results..."
            ];
          }
        });
      }
    }
  }, [elapsedTime, agentData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!agentData) {
    // Enhanced animated loading state
    return (
      <div className="p-5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 border border-blue-200 dark:border-blue-900/30">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Bot size={22} className="text-blue-500" />
              <motion.div 
                className="absolute -right-1 -top-1 size-1.5 rounded-full bg-green-400"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium shrink-0">Using FIRE-1</span>
              </div>
            </div>
          </div>
          
          {onStopAgent && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-xs h-8 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              onClick={onStopAgent}
            >
              <X size={14} />
              <span>Stop Agent</span>
            </Button>
          )}
        </div>

        <div className="space-y-2.5 mb-5">
          <motion.div 
            className="flex items-center gap-3 text-xs bg-zinc-200/80 dark:bg-zinc-700/30 p-2.5 pl-3 rounded"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Globe size={14} className="text-blue-500 shrink-0" />
            <span>{statusMessages[0]}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 text-xs bg-zinc-200/80 dark:bg-zinc-700/30 p-2.5 pl-3 rounded"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Code size={14} className="text-green-500 shrink-0" />
            <span>{statusMessages[1]}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 text-xs bg-zinc-200/80 dark:bg-zinc-700/30 p-2.5 pl-3 rounded"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <Braces size={14} className="text-purple-500 shrink-0" />
            <span>{statusMessages[2]}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3 text-xs bg-zinc-200/80 dark:bg-zinc-700/30 p-2.5 pl-3 rounded"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: [1, 0.7, 1],
              backgroundColor: ["hsl(var(--zinc-200) / 0.8)", "hsl(var(--zinc-300) / 0.8)", "hsl(var(--zinc-200) / 0.8)"]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <Laptop size={14} className="text-amber-500 shrink-0" />
            <div className="w-full flex items-center justify-between">
              <span>{statusMessages[3]}</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="shrink-0"
              >
                <RotateCw size={12} className="text-blue-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ 
              width: elapsedTime < 30 
                ? ["0%", "40%", "60%", "75%", "85%"] 
                : ["85%", "88%", "91%", "93%", "95%"]
            }}
            transition={{ 
              duration: elapsedTime < 30 ? 8 : 12, 
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 1]
            }}
          />
        </div>
        
        {elapsedTime > 45 && (
          <div className="mt-4 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
            <p className="font-medium">Taking longer than expected?</p>
            <p className="mt-1">FIRE-1 agents can take 1-2 minutes for complex websites. For very complex tasks with forms, pagination or login steps, it might take longer.</p>
            {onStopAgent && (
              <p className="mt-1">If it&apos;s taking too long, you can stop the agent and try with more specific instructions.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (agentData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-5 text-red-800 dark:text-red-200">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={18} className="text-red-500" />
          <h3 className="font-medium">Agent Operation Failed</h3>
        </div>
        <p className="mt-2">{agentData.error}</p>
      </div>
    );
  }
  
  if (agentData.message) {
    return (
      <div className="p-5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 border border-blue-200 dark:border-blue-900/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Bot size={20} className="text-blue-500" />
              <motion.div 
                className="absolute -right-1 -top-1 size-1.5 rounded-full bg-green-400"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium shrink-0">Using FIRE-1</span>
              </div>
            </div>
          </div>
          
          {onStopAgent && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-xs h-8 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              onClick={onStopAgent}
            >
              <X size={14} />
              <span>Stop Agent</span>
            </Button>
          )}
        </div>
        
        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 ml-0.5 bg-zinc-100 dark:bg-zinc-800/70 p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">Current Status:</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="inline-block"
            >
              <RotateCw size={12} className="text-blue-500" />
            </motion.div>
          </div>
          <p>{agentData.message}</p>
          
          <div className="text-xs text-zinc-500 mt-3">
            {statusMessages[Math.floor(Math.random() * statusMessages.length)]}
          </div>
        </div>
        
        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{ 
              width: ["30%", "60%", "85%", "95%"],
              x: ["-5%", "5%", "-5%"]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          />
        </div>
        
        {elapsedTime > 45 && (
          <div className="mt-4 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
            <p className="font-medium">Taking longer than expected?</p>
            <p className="mt-1">FIRE-1 agents can take 1-2 minutes for complex websites. For very complex tasks with multi-page navigation, it might take longer.</p>
          </div>
        )}
      </div>
    );
  }

  const data = agentData.data;
  if (!data) {
    return (
      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={18} className="text-zinc-500" />
          <h3 className="font-medium">Agent Completed</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 ml-0.5 mt-2">No data returned from the agent operation.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all overflow-hidden border border-zinc-200 dark:border-zinc-700"
      >
        {/* Header with agent label */}
        <div className="mb-4 flex items-center gap-2">
          <Bot size={18} className="text-blue-500" />
          <h3 className="font-medium text-blue-700 dark:text-blue-400">FIRE-1 Agent Results</h3>
        </div>
        
        {/* Title and URL section */}
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
        
        {/* Agent prompt and response */}
        {data.agentPrompt && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-zinc-700 dark:text-zinc-300">
            <p className="font-medium mb-2">Agent Instructions:</p>
            <p>{data.agentPrompt}</p>
          </div>
        )}
        
        {data.agentResponse && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-sm text-zinc-700 dark:text-zinc-300">
            <p className="font-medium mb-2">Agent Response:</p>
            <p>{data.agentResponse}</p>
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
        
        {/* Main content */}
        {data.markdown && (
          <div className="prose dark:prose-invert prose-sm max-w-none mb-4">
            <Markdown>{data.markdown}</Markdown>
          </div>
        )}
        
        {/* Links */}
        {data.links && data.links.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="text-md font-medium mb-3">Page Links:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden">
              {data.links.slice(0, 10).map((link, index) => (
                <a 
                  key={index}
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline truncate flex items-center gap-1 p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                >
                  <span className="shrink-0 size-1.5 rounded-full bg-blue-500 mr-1"></span>
                  {link.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              ))}
            </div>
            {data.links.length > 10 && (
              <p className="text-sm text-zinc-500 mt-2">
                + {data.links.length - 10} more links
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}; 