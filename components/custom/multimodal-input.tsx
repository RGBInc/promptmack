"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import React, { useRef, useEffect, useState, useCallback, Dispatch, SetStateAction, ChangeEvent } from "react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon, NewsIcon, ScholarIcon, FileTextIcon, VideoIcon, NetworkIcon, BrainIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
  {
    title: "Form",
    label: "Submit",
    action: "Fill out and submit a form on a website",
    icon: <FileTextIcon size={14} />
  },
  {
    title: "News",
    label: "Latest",
    action: "Show me the latest news",
    icon: <NewsIcon size={14} />
  },
  {
    title: "Videos",
    label: "Trending",
    action: "Show me trending videos",
    icon: <VideoIcon size={14} />
  },
  {
    title: "Scholar",
    label: "Research",
    action: "Find scholarly articles",
    icon: <ScholarIcon size={14} />
  },
  {
    title: "Similar",
    label: "Websites",
    action: "Find websites similar to",
    icon: <NetworkIcon size={14} />
  },
  {
    title: "Brainstorm",
    label: "Ideas",
    action: "Help me brainstorm ideas, employ the principles of first principles and reason through with me, you take very highly abstract ideas and help me turn them into results.",
    icon: <BrainIcon size={14} />
  }
];

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
    
    // Add event listener for viewport changes (like keyboard appearing)
    window.addEventListener('resize', adjustHeight);
    
    // Auto focus the textarea on desktop
    if (width && width > 768 && textareaRef.current) {
      textareaRef.current.focus();
    }
    
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, [width]);
  
  // Also adjust height when input changes
  useEffect(() => {
    adjustHeight();
  }, [input]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
      
      // Scroll to the textarea when focused on mobile
      if (document.activeElement === textareaRef.current) {
        setTimeout(() => {
          textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [attachments, handleSubmit, setAttachments, width]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className="w-full"
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="border-none bg-muted/50 text-center border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg px-2 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col w-full"
                >
                  <div className="flex items-center justify-center mb-1">
                    {suggestedAction.icon}
                  </div>
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="flex flex-row gap-2 overflow-x-scroll">
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Ask anything or describe what you'd like to do..."
        value={input}
        onChange={handleInput}
        className="h-24 overflow-y-auto resize-none rounded-lg text-base bg-muted border-none"
        rows={3}
        style={{ maxHeight: "96px" }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            if (!event.shiftKey) {
              // Regular Enter - submit form
              event.preventDefault();
              
              if (isLoading) {
                toast.error("Please wait for the model to finish its response!");
              } else if (input.trim().length > 0 || attachments.length > 0) {
                submitForm();
              }
            }
            // If Shift+Enter, let the default behavior happen (create a new line)
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-200 ease-out hover:scale-105"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-10 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading}
      >
        <PaperclipIcon size={14} />
      </Button>
    </div>
  );
}
