/* eslint-disable react/react-in-jsx-scope */
"use client";

import { Attachment, Message } from "ai";
import { useChat } from 'ai/react';
import React, { useEffect, useState, useCallback } from "react";

// import { Footer } from "./footer";
import { Message as PreviewMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { useScrollToBottom } from "./use-scroll-to-bottom";
// import { Overview } from "./overview";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
        setTimeout(() => scrollToBottom(), 100);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
    
  // Manual scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end'
      });
    }
  }, [messagesEndRef]);
  
  // Force scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages.length, scrollToBottom]);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-row justify-center h-dvh bg-background overflow-hidden">
      <div className="flex flex-col size-full max-w-3xl relative">
        <div className="px-4 size-full overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-3 w-full items-center h-[calc(100%-80px)] overflow-y-auto pb-32 chat-container scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

            {messages.map((message) => (
              <PreviewMessage
                key={message.id}
                chatId={id}
                role={message.role}
                content={message.content}
                attachments={message.experimental_attachments}
                toolInvocations={message.toolInvocations}
              />
            ))}

            <div
              ref={messagesEndRef}
              className="shrink-0 min-w-[24px] min-h-[24px]"
            />
          </div>
        </div>

        <form className="fixed bottom-0 flex flex-row gap-2 items-end w-full max-w-3xl bg-background/80 backdrop-blur-sm input-container">
          <div className="w-full p-4">
            <MultimodalInput
              input={input}
              setInput={setInput}
              handleSubmit={(e, opts) => {
                handleSubmit(e, opts);
                // Schedule a scroll to bottom after submission
                setTimeout(() => scrollToBottom(), 100);
              }}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              append={append}
            />
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
