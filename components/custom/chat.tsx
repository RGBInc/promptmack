/* eslint-disable react/react-in-jsx-scope */
"use client";

import { Attachment, Message } from "ai";
import { useChat } from 'ai/react';
import React, { useEffect, useState, useCallback } from "react";

import { Message as PreviewMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { useScrollToBottom } from "./use-scroll-to-bottom";

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
        // Let the auto-scroll hook handle scrolling for smoother experience
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  // Auto-scroll to top when chat ID changes (navigation from history)
  useEffect(() => {
    // Scroll to top of the page for fluid navigation experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Also scroll the messages container to top for new chats
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [id, messagesContainerRef]);

  return (
    <div className="flex flex-row justify-center h-dvh bg-background overflow-hidden">
      <div className="flex flex-col size-full max-w-3xl relative">
        <div className="px-4 size-full overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-3 w-full items-center h-[calc(100%-80px)] overflow-y-auto pb-32 chat-container scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch', 
              overscrollBehavior: 'contain',
              scrollBehavior: 'smooth'
            }}>

            {messages.map((message) => (
              <PreviewMessage
                key={message.id}
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

        <form className="fixed bottom-0 flex flex-row gap-2 items-end w-full max-w-3xl input-container">
          <div className="w-full p-4">
            <MultimodalInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
            />
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
