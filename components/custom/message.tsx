"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "../weather/weather";
import { News } from "../news/news";
import { Videos } from "../news/videos";
import { Shopping } from "../news/shopping";
import { Scholar } from "../news/scholar";
import { Similar } from "../news/similar";
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
  return (
    <motion.div
      className="flex flex-col px-4 w-full md:w-[750px] md:px-0 first-of-type:pt-20 py-2"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex gap-3 w-full items-start">
        {role === "assistant" && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white text-xs shrink-0">AI</div>
        )}
        {role === "user" && (
          <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div className="flex flex-col gap-1.5 flex-1">
          {content && typeof content === "string" && (
            <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
              <Markdown>{content}</Markdown>
            </div>
          )}

          {toolInvocations && (
            <div className="flex flex-col gap-2">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
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
                    <div key={toolCallId} className="skeleton">
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
            </div>
          )}

          {attachments && (
            <div className="flex flex-row gap-2">
              {attachments.map((attachment) => (
                <PreviewAttachment key={attachment.url} attachment={attachment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
