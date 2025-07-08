"use client";

import React, { useRef, useEffect, useState, useCallback, Dispatch, SetStateAction, ChangeEvent } from "react";

import { Attachment, ChatRequestOptions, Message } from "ai";
import { Search, Globe, Map, Database, X, ChevronLeft, ChevronRight , Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ArrowUpIcon, PaperclipIcon, StopIcon, NewsIcon, ScholarIcon, FileTextIcon, VideoIcon, NetworkIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import useWindowSize from "./use-window-size";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const suggestedActions = [
  {
    title: "News",
    label: "Latest",
    action: "Show me the latest news",
    description: "Get the most recent news from around the world",
    icon: <NewsIcon size={16} />,
    category: "Information",
    tags: ["News", "Current Events"]
  },
  {
    title: "Videos",
    label: "Trending",
    action: "Show me trending videos",
    description: "Discover the most popular videos right now",
    icon: <VideoIcon size={16} />,
    category: "Media",
    tags: ["Videos", "Trending"]
  },
  {
    title: "Scholar",
    label: "Research",
    action: "Find scholarly articles about",
    description: "Search for academic papers and research",
    icon: <ScholarIcon size={16} />,
    category: "Research",
    tags: ["Academic", "Papers"]
  },
  {
    title: "Form",
    label: "Submit",
    action: "Fill out and submit a form on a website",
    description: "Automate form completion on websites",
    icon: <FileTextIcon size={16} />,
    category: "Automation",
    tags: ["Forms", "Websites"]
  },
  {
    title: "Similar",
    label: "Websites",
    action: "Find websites similar to",
    description: "Discover websites related to a specific URL",
    icon: <NetworkIcon size={16} />,
    category: "Discovery",
    tags: ["Websites", "Similar"]
  },
  {
    title: "Search",
    label: "Web",
    action: "Search the web for information about",
    description: "Find comprehensive information online",
    icon: <Search size={16} />,
    category: "Search",
    tags: ["Web", "Information"]
  },
  {
    title: "Scrape",
    label: "Content",
    action: "Extract content from a specific URL",
    description: "Get text content from a webpage",
    icon: <Globe size={16} />,
    category: "Data",
    tags: ["Extraction", "Content"]
  },
  {
    title: "Map",
    label: "Website",
    action: "Map all URLs on a website",
    description: "Create a site map of all linked pages",
    icon: <Map size={16} />,
    category: "Analysis",
    tags: ["Mapping", "URLs"]
  },
  {
    title: "Extract",
    label: "Data",
    action: "Extract structured data from a website",
    description: "Pull organized information from webpages",
    icon: <Database size={16} />,
    category: "Data",
    tags: ["Structured", "Extraction"]
  },
  {
    title: "Crawl",
    label: "Website",
    action: "Crawl an entire website for content",
    description: "Explore all pages on a website systematically",
    icon: <Globe size={16} strokeWidth={1.5} />,
    category: "Data",
    tags: ["Crawling", "Complete"]
  }
];

// Replace the color palette with more subtle, elegant colors
const categoryColors: Record<string, string> = {
  "Information": "hsl(221, 70%, 55%)",    // more muted blue
  "Media": "hsl(262, 60%, 60%)",          // softer purple
  "Research": "hsl(142, 50%, 45%)",       // muted green
  "Automation": "hsl(327, 50%, 55%)",     // softer pink
  "Discovery": "hsl(43, 70%, 55%)",       // softer yellow
  "Search": "hsl(0, 65%, 60%)",           // muted red
  "Data": "hsl(199, 65%, 50%)",           // muted cyan
  "Analysis": "hsl(174, 50%, 50%)",       // muted teal
  "Creation": "hsl(280, 60%, 65%)",       // muted fuchsia
};

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Adjust cards per page based on screen size
  const cardsPerPage = width && width < 640 ? 6 : 8; // 6 on mobile, 8 on larger screens



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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const handleUseClick = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Always populate the input field instead of showing modal or auto-submitting
    setInput(action);
    setShowTextInput(false); // Hide quick prompts after selection
    setIsExpanded(false); // Reset expanded state
    
    // Focus the textarea for immediate editing
    setTimeout(() => {
      textareaRef.current?.focus();
      // Position cursor at the end of the text
      if (textareaRef.current) {
        const length = action.length;
        textareaRef.current.setSelectionRange(length, length);
      }
    }, 100);
  };



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
  




  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSearchTerm("");
  };

  // Filter actions based on search term
  const filteredActions = searchTerm.trim() === "" 
    ? suggestedActions 
    : suggestedActions.filter(action => 
        action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        action.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
  // Calculate pagination
  const totalPages = Math.ceil(filteredActions.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredActions.slice(indexOfFirstCard, indexOfLastCard);
  
  // Update the page change handlers with debounce to prevent rapid re-renders

  const nextPage = useCallback(() => {
    if (currentPage < totalPages && !isPageChanging) {
      setIsPageChanging(true);
      setCurrentPage(current => current + 1);
      
      // Add a small delay to prevent rapid re-renders
      setTimeout(() => {
        setIsPageChanging(false);
      }, 300);
    }
  }, [currentPage, totalPages, isPageChanging]);

  const prevPage = useCallback(() => {
    if (currentPage > 1 && !isPageChanging) {
      setIsPageChanging(true);
      setCurrentPage(current => current - 1);
      
      // Add a small delay to prevent rapid re-renders
      setTimeout(() => {
        setIsPageChanging(false);
      }, 300);
    }
  }, [currentPage, isPageChanging]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="relative w-full flex flex-col gap-2">
      <TooltipProvider>

      {/* Hover-activated quick prompts for existing chats */}
      {messages.length > 0 && (
        <div 
          className="group mb-2 relative"
          onMouseEnter={() => setShowTextInput(true)}
          onMouseLeave={() => {
            setShowTextInput(false);
            setIsExpanded(false);
          }}
        >
          {/* Invisible hover trigger area */}
          <div className="absolute -top-2 -inset-x-4 h-8 z-10" />
          
          {/* Subtle indicator when not hovered */}
          {!showTextInput && (
            <div className="flex items-center justify-end mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                <Sparkles className="size-3" />
                <span className="text-xs">Hover for prompts</span>
              </div>
            </div>
          )}
          
          {/* Quick prompts panel */}
          {showTextInput && (
            <div className="space-y-2 p-3 rounded-lg bg-background/95 backdrop-blur-sm border border-muted/50 shadow-lg">
              {/* Ultra-minimal header */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search prompts (title, description, tags)..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="h-7 text-xs px-6 bg-background/80 border-0 ring-1 ring-muted/60 focus-visible:ring-primary/40"
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-4 p-0 hover:bg-muted"
                      onClick={clearSearch}
                    >
                      <X className="size-3" />
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTextInput(false)}
                  className="size-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
                >
                  <X className="size-3" />
                </Button>
              </div>
              
              {/* Prompts display - either horizontal scroll or expanded grid */}
              {!isExpanded ? (
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {filteredActions.slice(0, 8).map((suggestedAction, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        handleUseClick(e, suggestedAction.action);
                      }}
                      className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-background/80 hover:bg-primary/10 hover:text-primary border border-muted/60 hover:border-primary/30 transition-all duration-200 whitespace-nowrap group"
                      title={suggestedAction.description}
                    >
                      <span className="flex items-center gap-1.5">
                        <div 
                          className="rounded-full size-1.5 transition-all group-hover:size-2"
                          style={{ backgroundColor: categoryColors[suggestedAction.category] }}
                        />
                        {suggestedAction.title}
                      </span>
                    </button>
                  ))}
                  
                  {filteredActions.length > 8 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-xs h-auto py-1.5 px-3 text-muted-foreground hover:text-foreground rounded-full border border-dashed border-muted/60 hover:border-muted"
                      onClick={() => setIsExpanded(true)}
                    >
                      +{filteredActions.length - 8}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 pr-2">
                    {currentCards.map((suggestedAction, index) => (
                      <button
                        key={indexOfFirstCard + index}
                        onClick={(e) => {
                          e.preventDefault();
                          handleUseClick(e, suggestedAction.action);
                        }}
                        className="p-2 text-xs font-medium rounded-lg bg-background/80 hover:bg-primary/10 hover:text-primary border border-muted/60 hover:border-primary/30 transition-all duration-200 text-left group"
                        title={suggestedAction.description}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="rounded-full size-1.5 transition-all group-hover:size-2 shrink-0"
                            style={{ backgroundColor: categoryColors[suggestedAction.category] }}
                          />
                          <span className="font-medium truncate">{suggestedAction.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground/80">
                          {suggestedAction.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Pagination for expanded view */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-muted/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setIsExpanded(false)}
                    >
                      Show less
                    </Button>
                    
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            prevPage();
                          }}
                          disabled={currentPage === 1 || isPageChanging}
                          className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="size-3" />
                        </button>
                        
                        <span className="px-2 text-xs font-medium">
                          {currentPage}/{totalPages}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            nextPage();
                          }}
                          disabled={currentPage === totalPages || isPageChanging}
                          className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Full prompt view for home page or when expanded */}
      {messages.length === 0 && (
            <div className="flex flex-col gap-4">
              {/* Header with search */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 pb-3 -mx-4 px-4 border-b border-border/40">
                <div className="flex items-center gap-2 relative">
                  <Input
                    placeholder="Search prompts (title, description, tags)..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-9 bg-background/50 border-0 ring-1 ring-muted focus-visible:ring-2"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 size-6 p-0"
                      onClick={clearSearch}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Clearer grid layout with better spacing for mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
                {filteredActions.length > 0 ? (
                  currentCards.map((suggestedAction, index) => (
              <div
                      key={indexOfFirstCard + index}
                className="w-full"
              >
                      <Card 
                        className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/30 hover:shadow-md hover:scale-[1.02] h-full shadow-sm dark:shadow-none bg-card/60 backdrop-blur-sm border-muted/60 cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault();
                          handleUseClick(e, suggestedAction.action);
                        }}
                      >
                        <div className="px-4 pt-4 pb-2">
                          <div className="flex items-baseline justify-between">
                            <h3 className="font-medium text-sm tracking-tight group-hover:text-primary transition-colors">
                              {suggestedAction.title}
                            </h3>
                            <div 
                              className="rounded-full size-1.5 transition-all group-hover:size-2"
                              style={{ backgroundColor: categoryColors[suggestedAction.category] }}
                            />
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                            {suggestedAction.description}
                          </p>
                        </div>
                        
                        <div className="px-4 pb-3 pt-1 flex items-center justify-between mt-auto">
                          <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            {suggestedAction.label}
                          </span>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="size-7 p-0 bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUseClick(e, suggestedAction.action);
                                }}
                              >
                                <ArrowUpIcon size={12} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Use this prompt</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <Search className="size-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-1">No matching prompts found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your search terms or explore different categories
                    </p>
                    <Button variant="outline" onClick={() => clearSearch()} className="mt-4">
                      Clear search
                    </Button>
                  </div>
                )}
                
                {/* Seamless pagination - integrated into the grid and closer to prompts */}
                {totalPages > 1 && (
                  <div className="col-span-full flex items-center justify-center mt-1 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          prevPage();
                        }}
                        disabled={currentPage === 1 || isPageChanging}
                        className="p-2 rounded-md hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      
                      <span className="px-3 text-sm font-medium">
                        {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          nextPage();
                        }}
                        disabled={currentPage === totalPages || isPageChanging}
                        className="p-2 rounded-md hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
        )}

      <input
        type="file"
        className="absolute inset-0 size-0 opacity-0 pointer-events-none"
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

      {/* Always show textarea for better UX - users can freely type or use quick prompts */}
      <div className="relative">
        <div className="transition-all duration-300 ease-in-out">
          <Textarea
            ref={textareaRef}
            placeholder={
              messages.length === 0 
                ? "Ask me anything or use a quick prompt above..." 
                : showTextInput
                  ? "Type your message or use a quick prompt above..."
                  : "Type your message here..."
            }
            value={input}
            onChange={(event) => setInput(event.target.value)}
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
                    handleSubmit(undefined, {
                      experimental_attachments: attachments,
                    });
                    
                    // Reset state
                    setAttachments([]);
                    
                    if (width && width > 768) {
                      textareaRef.current?.focus();
                    }
                  }
                }
              }
              // If Shift+Enter, let the default behavior happen (create a new line)
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
                handleSubmit(undefined, {
                  experimental_attachments: attachments,
                });
                
                setAttachments([]);
                
                if (width && width > 768) {
                  textareaRef.current?.focus();
                }
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

          {/* Quick Prompts button for all devices - only show in existing chats */}
          {messages.length > 0 && (
            <Button
              className="rounded-full p-1.5 h-fit absolute bottom-2 right-[4.5rem] m-0.5 dark:border-zinc-700"
              onClick={(event) => {
                event.preventDefault();
                setShowTextInput(!showTextInput);
              }}
              variant="outline"
              disabled={isLoading}
              title="Quick Prompts"
            >
              <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      </TooltipProvider>


    </div>
  );
}
