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
import { AuthorizePayment } from "../flights/authorize-payment";
import { DisplayBoardingPass } from "../flights/boarding-pass";
import { CreateReservation } from "../flights/create-reservation";
import { FlightStatus } from "../flights/flight-status";
import { ListFlights } from "../flights/list-flights";
import { SelectSeats } from "../flights/select-seats";
import { VerifyPayment } from "../flights/verify-payment";
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
  chatId,
  role,
  content,
  toolInvocations,
  attachments,
}: {
  chatId: string;
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
      className="flex flex-col w-full max-w-2xl first-of-type:pt-16 py-0.5"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Regular message content with avatar and bubble */}
      {content && typeof content === "string" && !toolInvocations?.length && !attachments?.length && (
        <div className={`flex gap-3 w-full px-1 sm:px-0 overflow-x-hidden ${visualMode === 'bubble' ? (role === "user" ? "justify-end" : "justify-start") : ""}`}>
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
            className={`flex flex-col gap-2 ${visualMode === 'mechanical' ? 'w-full md:w-[calc(100%-2rem)]' : 'inline-block max-w-[80%]'} ${visualMode === 'bubble' ? bubbleStyles[role as keyof typeof bubbleStyles] : mechanicalStyles[role as keyof typeof mechanicalStyles]}`}
          >
            <div className="text-zinc-800 dark:text-zinc-200 flex flex-col gap-3 leading-relaxed">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* Message content when tool results are present */}
      {content && typeof content === "string" && (toolInvocations?.length || attachments?.length) && (
        <div className="w-full px-1 sm:px-0 mb-3">
          <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      )}
    
      {/* Tool results and attachments without avatar/bubble */}
      {(toolInvocations || attachments) && (
        <div className="w-full flex flex-col gap-3 px-1 sm:px-0">
          {toolInvocations && toolInvocations.map((toolInvocation) => {
            const { toolName, toolCallId, state } = toolInvocation;
  
            if (state === "result") {
              const { result } = toolInvocation;
  
              return (
                <div key={toolCallId} className="w-full overflow-x-hidden">
                  {toolName === "getWeather" ? (
                    <Weather weatherAtLocation={result} />
                  ) : toolName === "displayFlightStatus" ? (
                    <FlightStatus flightStatus={result} />
                  ) : toolName === "searchFlights" ? (
                    <ListFlights chatId={chatId} results={result} />
                  ) : toolName === "selectSeats" ? (
                    <SelectSeats chatId={chatId} availability={result} />
                  ) : toolName === "createReservation" ? (
                    Object.keys(result).includes("error") ? null : (
                      <CreateReservation reservation={result} />
                    )
                  ) : toolName === "authorizePayment" ? (
                    <AuthorizePayment intent={result} />
                  ) : toolName === "displayBoardingPass" ? (
                    <DisplayBoardingPass boardingPass={result} />
                  ) : toolName === "verifyPayment" ? (
                    <VerifyPayment result={result} />
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
                  ) : (
                    <div>{JSON.stringify(result, null, 2)}</div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={toolCallId} className="skeleton w-full overflow-x-hidden">
                  {toolName === "getWeather" ? (
                    <Weather />
                  ) : toolName === "displayFlightStatus" ? (
                    <FlightStatus />
                  ) : toolName === "searchFlights" ? (
                    <ListFlights chatId={chatId} />
                  ) : toolName === "selectSeats" ? (
                    <SelectSeats chatId={chatId} />
                  ) : toolName === "createReservation" ? (
                    <CreateReservation />
                  ) : toolName === "authorizePayment" ? (
                    <AuthorizePayment />
                  ) : toolName === "displayBoardingPass" ? (
                    <DisplayBoardingPass />
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
                  ) : null}
                </div>
              );
            }
          })}
          {attachments?.map((attachment) => (
            <div key={attachment.url} className="w-full overflow-x-hidden">
              <PreviewAttachment attachment={attachment} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};