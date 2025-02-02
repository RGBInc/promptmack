"use client";

import { useVisualMode } from "./visual-mode-context";
import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { User, Bot } from "lucide-react";

import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "../weather/weather";
import { News } from "../paid/news";
import { Videos } from "../paid/videos";
import { Shopping } from "../paid/shopping";
import { Scholar } from "../paid/scholar";
import { Similar } from "../paid/similar";
import { AuthorizePayment } from "../flights/authorize-payment";
import { DisplayBoardingPass } from "../flights/boarding-pass";
import { CreateReservation } from "../flights/create-reservation";
import { FlightStatus } from "../flights/flight-status";
import { ListFlights } from "../flights/list-flights";
import { SelectSeats } from "../flights/select-seats";
import { VerifyPayment } from "../flights/verify-payment";

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
    user: "pb-4",
    assistant: "pb-4",
  };

  const bubbleStyles = {
    user: "bg-blue-100 dark:bg-blue-900 p-3 rounded-2xl rounded-tr-sm",
    assistant: "bg-gray-100 dark:bg-gray-900 p-3 rounded-2xl rounded-tl-sm",
  };

  return (
    <motion.div
      className={`flex flex-col w-full max-w-full md:max-w-[850px] first-of-type:pt-20 py-3 ${
        visualMode === 'bubble' ? (role === "user" ? "items-end px-2 sm:px-4 md:px-0" : "items-start px-2 sm:px-4 md:px-0") : ""
      }`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className={`flex gap-3 w-full ${
        visualMode === 'bubble' ? (role === "user" ? "justify-end" : "justify-start") : ""
      }`}>
        {visualMode === 'mechanical' && (
          <div className="flex flex-col items-center h-fit">
            <div className="h-5 w-5 mt-1 flex-shrink-0">
              {role === 'user'
                ? <User className="h-5 w-5 text-blue-400" />
                : <Bot className="h-5 w-5 text-zinc-400" />
              }
            </div>
            {content && typeof content === "string" && (
              <div className="w-[1px] h-full bg-zinc-200 dark:bg-zinc-700 mt-2" style={{ height: 'calc(100% - 1.75rem)' }} />
            )}
          </div>
        )}
        <div 
          className={`flex flex-col gap-2.5 ${
            visualMode === 'mechanical' 
              ? 'w-full md:w-[calc(850px-2rem)]' 
              : 'max-w-[85%] sm:max-w-[80%]'
          } ${
            visualMode === 'bubble' 
              ? bubbleStyles[role as keyof typeof bubbleStyles] 
              : mechanicalStyles[role as keyof typeof mechanicalStyles]
          }`}
        >
          {content && typeof content === "string" && (
            <div className="text-zinc-800 dark:text-zinc-200 flex flex-col gap-4 leading-relaxed">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>
      </div>

      {(toolInvocations || attachments) && (
        <div className="w-full flex flex-col gap-4 mt-8">
          {toolInvocations && toolInvocations.map((toolInvocation) => {
            const { toolName, toolCallId, state } = toolInvocation;

            if (state === "result") {
              const { result } = toolInvocation;

              return (
                <div key={toolCallId} className="w-full md:w-[calc(850px-2rem)]">
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
                  ) : toolName === "getShopping" ? (
                    <Shopping shoppingData={result} />
                  ) : toolName === "getScholar" ? (
                    <Scholar scholarData={result} />
                  ) : toolName === "findSimilar" ? (
                    <Similar similarData={result} />
                  ) : (
                    <div>{JSON.stringify(result, null, 2)}</div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={toolCallId} className="skeleton w-full">
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
                  ) : toolName === "getShopping" ? (
                    <Shopping />
                  ) : toolName === "getScholar" ? (
                    <Scholar />
                  ) : toolName === "findSimilar" ? (
                    <Similar />
                  ) : null}
                </div>
              );
            }
          })}
          {attachments?.map((attachment) => (
            <div key={attachment.url} className="w-full md:w-[calc(850px-2rem)]">
              <PreviewAttachment attachment={attachment} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
