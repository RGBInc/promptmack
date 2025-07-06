"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { Search, Globe, Map, Database, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useRef, useEffect, useState, useCallback, Dispatch, SetStateAction, ChangeEvent } from "react";
import { toast } from "sonner";

// Uncomment these icons that we need now
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
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [editedPromptText, setEditedPromptText] = useState("");
  const [copiedItemId, setCopiedItemId] = useState<number | null>(null);
  
  // Adjust cards per page based on screen size
  const cardsPerPage = width && width < 640 ? 5 : 8; // 5 on mobile (updated), 8 on larger screens



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

  const handleUseClick = (e: React.MouseEvent, action: string, shouldEdit: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (shouldEdit) {
      setEditingPrompt(action);
      setEditedPromptText(action);
    } else {
      append({
        role: "user",
        content: action,
      });
      setPromptSubmitted(true);
    }
  };

  const handlePromptEdit = () => {
    if (editedPromptText.trim()) {
      append({
        role: "user",
        content: editedPromptText,
      });
      setPromptSubmitted(true);
    }
    setEditingPrompt(null);
    setEditedPromptText("");
  };

  const handleCancelEdit = () => {
    setEditingPrompt(null);
    setEditedPromptText("");
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
  
  const handleCopy = (e: React.MouseEvent, action: string, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(action).then(() => {
      setCopiedItemId(index);
      toast.success("Copied to clipboard!");
      
      setTimeout(() => {
        if (copiedItemId === index) {
          setCopiedItemId(null);
        }
      }, 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast.error("Failed to copy text!");
    });
  };



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
  const goToPage = useCallback((pageNumber: number) => {
    if (isPageChanging) return; // Prevent multiple rapid page changes
    
    setIsPageChanging(true);
    setCurrentPage(pageNumber);
    
    // Add a small delay to prevent rapid re-renders
    setTimeout(() => {
      setIsPageChanging(false);
    }, 300);
  }, [isPageChanging]);

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
    <div className="relative w-full flex flex-col gap-4">
      <TooltipProvider>
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
            <div className="flex flex-col gap-6">
              {/* Always show search at top, with better mobile styling */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 pb-3 -mx-4 px-4 border-b border-border/40">
                <div className="flex items-center gap-2 relative">
                  <Input
                    placeholder="Search prompts..."
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full mb-8">
                {filteredActions.length > 0 ? (
                  currentCards.map((suggestedAction, index) => (
              <motion.div
                      initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ 
                        delay: 0.03 * index,
                        duration: 0.2,
                        ease: "easeOut"
                      }}
                      key={indexOfFirstCard + index}
                className="w-full"
              >
                      <Card 
                        className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/30 hover:shadow-md hover:scale-[1.02] h-full shadow-sm dark:shadow-none bg-card/60 backdrop-blur-sm border-muted/60 cursor-pointer group"
                        onClick={(e) => {
                          e.preventDefault();
                          handleUseClick(e, suggestedAction.action, true);
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
                                className="h-7 w-7 p-0 bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUseClick(e, suggestedAction.action, true);
                                }}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Use this prompt</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </Card>
                    </motion.div>
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
              </div>
              
              {/* Mobile-friendly pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full" // Increased size for better mobile tapping
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any default behavior
                      e.stopPropagation(); // Stop event propagation
                      prevPage();
                    }}
                    disabled={currentPage === 1 || isPageChanging}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  
                  {/* Show simplified pagination on mobile */}
                  {width && width < 640 ? (
                    <span className="text-sm font-medium px-4 py-2"> {/* Increased touch target */}
                      {currentPage} / ∞
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first page, last page, current page, and pages around current
                        let pageToShow: number | null = null;
                        
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                          // Near start
                          if (i < 4) {
                            pageToShow = i + 1;
                          } else {
                            // Instead of showing last page, show infinity symbol
                            return (
                              <div key={`infinity-${i}`} className="size-9 flex items-center justify-center text-muted-foreground">
                                ∞
                              </div>
                            );
                          }
                        } else if (currentPage >= totalPages - 2) {
                          // Near end - but we won't reach this in an infinite system
                          if (i === 0) {
                            pageToShow = 1;
                          } else {
                            pageToShow = totalPages - (4 - i);
                          }
                        } else {
                          // Middle
                          if (i === 0) {
                            pageToShow = 1;
                          } else if (i === 4) {
                            // Instead of showing last page, show infinity symbol
                            return (
                              <div key={`infinity-${i}`} className="size-9 flex items-center justify-center text-muted-foreground">
                                ∞
                              </div>
                            );
                          } else {
                            pageToShow = currentPage + (i - 2);
                          }
                        }
                        
                        return (
                          <Button
                            key={`page-${pageToShow}`}
                            variant={currentPage === pageToShow ? "default" : "outline"}
                            size="sm"
                            className={`size-9 rounded-full ${
                              currentPage === pageToShow ? "" : "text-muted-foreground"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              goToPage(pageToShow!);
                            }}
                            disabled={isPageChanging}
                          >
                            {pageToShow}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full" // Increased size for better mobile tapping
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any default behavior
                      e.stopPropagation(); // Stop event propagation  
                      nextPage();
                    }}
                    disabled={currentPage === totalPages || isPageChanging}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
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

      {/* Show textarea only after user interaction or prompt submission */}
      {(promptSubmitted || input.length > 0 || attachments.length > 0) && (
        <div className="transition-all duration-300 ease-in-out">
          <Textarea
            ref={textareaRef}
            placeholder={promptSubmitted ? "Add more context or refine your request..." : "Ask me anything or use a suggested prompt above..."}
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
        </div>
      )}
      </TooltipProvider>

      {/* Sleek Prompt Editor Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 bg-white/80 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Customize Your Request</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tailor this prompt to your specific needs
              </p>
            </div>
            
            <div className="p-6">
              <textarea
                value={editedPromptText}
                onChange={(e) => setEditedPromptText(e.target.value)}
                className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter your prompt..."
                autoFocus
              />
            </div>
            
            <div className="p-6 pt-0 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePromptEdit}
                disabled={!editedPromptText.trim()}
                className="px-6 bg-primary hover:bg-primary/90"
              >
                <Play className="h-4 w-4 mr-2" />
                Get AI Response
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
