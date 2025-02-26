"use client";

import { Attachment, Message } from "ai";
import { useChat } from 'ai/react';
import { useState } from "react";

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
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-row justify-center h-dvh bg-background">
      <div className="flex flex-col w-full max-w-3xl relative">
        <div className="px-4 w-full">
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-3 w-full items-center overflow-y-auto pb-32">

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

        <form className="fixed bottom-0 flex flex-row gap-2 items-end w-full max-w-3xl bg-background/80 backdrop-blur-sm">
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
              append={append}
            />
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
