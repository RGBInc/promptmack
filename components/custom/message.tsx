"use client";

// Third-party imports
import { type Attachment, type ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import * as React from "react";
import { type ReactNode } from "react";

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