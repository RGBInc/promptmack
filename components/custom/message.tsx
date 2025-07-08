"use client";

// Third-party imports
import { type Attachment, type ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { Bot, User, ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { type ReactNode, useState } from "react";

// Local component imports
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { useVisualMode } from "./visual-mode-context";
// FirecrawlAgent import removed - FIRE-1 agent is now disabled
import { DataTableComponent } from "../data-table";
import { FirecrawlCrawl } from "../firecrawl/crawl";
import { FirecrawlExtract } from "../firecrawl/extract";
import { FirecrawlMap } from "../firecrawl/map";
import { FirecrawlScrape } from "../firecrawl/scrape";
import { FirecrawlSearch } from "../firecrawl/search";
// Flight components removed - dummy functionality cleaned up
import { News } from "../paid/news";
import { Scholar } from "../paid/scholar";
import { Similar } from "../paid/similar";
import { Skyvern } from "../paid/skyvern";
import { Videos } from "../paid/videos";
import { Weather } from "../weather/weather";

// Add this type near the top of the file, after imports
type SkyvernData = {
  task_id: string;
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
};

// Tool call details component
const ToolCallDetails = ({ toolInvocation }: { toolInvocation: ToolInvocation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toolName, args, state } = toolInvocation;

  return (
    <div className="mb-2 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isExpanded ? (
              <ChevronDown className="size-4 text-zinc-500" />
            ) : (
              <ChevronRight className="size-4 text-zinc-500" />
            )}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {toolName}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            state === 'result' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : state === 'call'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}>
            {state}
          </span>
        </div>
      </button>
      {isExpanded && (
        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-700">
          <div className="space-y-2">
            <div>
              <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Function Call</h4>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-2 text-xs font-mono">
                <span className="text-blue-600 dark:text-blue-400">{toolName}</span>
                <span className="text-zinc-600 dark:text-zinc-400">(</span>
                {args && Object.keys(args).length > 0 && (
                  <div className="ml-2 mt-1">
                    {Object.entries(args).map(([key, value], index) => (
                      <div key={key}>
                        <span className="text-purple-600 dark:text-purple-400">{key}</span>
                        <span className="text-zinc-600 dark:text-zinc-400">: </span>
                        <span className="text-green-600 dark:text-green-400">
                          {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
                        </span>
                        {index < Object.keys(args).length - 1 && <span className="text-zinc-600 dark:text-zinc-400">,</span>}
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-zinc-600 dark:text-zinc-400">)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  const { mode: visualMode } = useVisualMode();

  const mechanicalStyles = {
    user: "pb-1",
    assistant: "pb-1",
  };

  const bubbleStyles = {
    user: "bg-blue-100 dark:bg-blue-900 p-2.5 rounded-2xl rounded-tr-sm",
    assistant: "bg-gray-100 dark:bg-gray-900 p-2.5 rounded-2xl rounded-tl-sm",
  };

  return (
    <motion.div
      className="flex flex-col w-full max-w-2xl first-of-type:pt-20 pt-4 pb-3"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Regular message content with avatar and bubble */}
      {content && typeof content === "string" && !toolInvocations?.length && !attachments?.length && (
        <div className={`flex gap-3 w-full px-1 sm:px-0 overflow-hidden mb-2 ${visualMode === 'bubble' ? (role === "user" ? "justify-end" : "justify-start") : ""}`}>
          {visualMode === 'mechanical' && (
            <div className="flex flex-col items-center h-fit">
              <div className="size-5 mt-1 shrink-0">
                {role === 'user'
                  ? <User className="size-5 text-blue-400" />
                  : <Bot className="size-5 text-zinc-400" />
                }
              </div>
              <div className="w-px h-full bg-zinc-200 dark:bg-zinc-700 mt-2" style={{ height: 'calc(100% - 1.75rem)' }} />
            </div>
          )}
          <div 
            className={`flex flex-col gap-2 break-words ${visualMode === 'mechanical' ? 'flex-1 max-w-full' : 'inline-block max-w-[80%]'} ${visualMode === 'bubble' ? bubbleStyles[role as keyof typeof bubbleStyles] : mechanicalStyles[role as keyof typeof mechanicalStyles]}`}
          >
            <div className="text-zinc-800 dark:text-zinc-200 flex flex-col gap-3 leading-relaxed overflow-hidden">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        </div>
      )}
    
      {/* Message content when tool results are present */}
      {content && typeof content === "string" && (toolInvocations?.length || attachments?.length) && (
        <div className="w-full px-1 sm:px-0 mb-4 overflow-hidden">
          <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed break-words">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}
    
      {/* Tool results and attachments without avatar/bubble */}
      {(toolInvocations || attachments) && (
        <div className="w-full flex flex-col gap-4 px-1 sm:px-0">
          {toolInvocations && toolInvocations.map((toolInvocation) => {
            const { toolName, toolCallId, state } = toolInvocation;
  
            if (state === "result") {
              const { result } = toolInvocation;
  
              return (
                <div key={toolCallId} className="w-full overflow-hidden mb-2">
                  <ToolCallDetails toolInvocation={toolInvocation} />
                  {toolName === "getWeather" ? (
                    <Weather weatherAtLocation={result} />
                  ) : toolName === "getNews" ? (
                    <News newsData={result} />
                  ) : toolName === "getVideos" ? (
                    <Videos videosData={result} />
                  ) : toolName === "getScholar" ? (
                    <Scholar scholarData={result} />
                  ) : toolName === "findSimilar" ? (
                    <Similar similarData={result} />
                  ) : toolName === "skyvernFormSubmit" ? (
                    <Skyvern skyvernData={result as SkyvernData} />
                  ) : toolName === "firecrawlScrape" ? (
                    <FirecrawlScrape scrapeData={result} />
                  ) : toolName === "firecrawlCrawl" ? (
                    <FirecrawlCrawl crawlData={result} />
                  ) : toolName === "firecrawlMap" ? (
                    <FirecrawlMap mapData={result} />
                  ) : toolName === "firecrawlSearch" ? (
                    <FirecrawlSearch searchData={result} />
                  ) : toolName === "firecrawlExtract" ? (
                    <FirecrawlExtract extractData={result} />
                  ) : toolName === "dataTable" ? (
                    <DataTableComponent result={result} />
                  ) : toolName === "firecrawlAgent" ? (
                    // FIRE-1 agent is disabled
                    <div className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 border border-amber-200 dark:border-amber-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot size={18} className="text-amber-500" />
                        <h3 className="font-medium text-amber-600 dark:text-amber-400">FIRE-1 Agent Disabled</h3>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">The FIRE-1 agent has been disabled. Please use other search or extraction tools instead.</p>
                    </div>

                  ) : (
                    <div>{JSON.stringify(result, null, 2)}</div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={toolCallId} className="skeleton w-full overflow-hidden mb-2">
                  <ToolCallDetails toolInvocation={toolInvocation} />
                  {toolName === "getWeather" ? (
                    <Weather />
                  ) : toolName === "getNews" ? (
                    <News />
                  ) : toolName === "getVideos" ? (
                    <Videos />
                  ) : toolName === "getScholar" ? (
                    <Scholar />
                  ) : toolName === "findSimilar" ? (
                    <Similar />
                  ) : toolName === "skyvernFormSubmit" ? (
                    <Skyvern skyvernData={null as unknown as SkyvernData} />
                  ) : toolName === "firecrawlScrape" ? (
                    <FirecrawlScrape />
                  ) : toolName === "firecrawlCrawl" ? (
                    <FirecrawlCrawl />
                  ) : toolName === "firecrawlMap" ? (
                    <FirecrawlMap />
                  ) : toolName === "firecrawlSearch" ? (
                    <FirecrawlSearch />
                  ) : toolName === "firecrawlExtract" ? (
                    <FirecrawlExtract />
                  ) : toolName === "dataTable" ? (
                    <div className="animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-lg h-32 w-full" />
                  ) : toolName === "firecrawlAgent" ? (
                    // FIRE-1 agent is disabled
                    <div className="p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 border border-amber-200 dark:border-amber-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot size={18} className="text-amber-500" />
                        <h3 className="font-medium text-amber-600 dark:text-amber-400">FIRE-1 Agent Disabled</h3>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">The FIRE-1 agent has been disabled. Please use other search or extraction tools instead.</p>
                    </div>

                  ) : null}
                </div>
              );
            }
          })}
          {attachments?.map((attachment) => (
            <div key={attachment.url} className="w-full overflow-hidden mb-2">
              <PreviewAttachment attachment={attachment} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};