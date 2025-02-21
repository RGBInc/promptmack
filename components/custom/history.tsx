"use client";

import cx from "classnames";
import { History as HistoryIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Chat } from "@/db/schema";
import { fetcher, getTitleFromChat } from "@/lib/utils";

import {
  InfoIcon,
  MoreHorizontalIcon,
  PencilEditIcon,
  TrashIcon,
} from "./icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,

  SheetTrigger,
} from "../ui/sheet";

export const History = ({ user }: { user: User | undefined }) => {
  const { id } = useParams();
  const pathname = usePathname();

  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>(user ? "/api/history" : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((history) => {
          if (history) {
            return history.filter((h) => h.id !== id);
          }
        });
        return "Chat deleted successfully";
      },
      error: "Failed to delete chat",
    });

    setShowDeleteDialog(false);
  };

  return (
    <>
      <Sheet open={isHistoryVisible} onOpenChange={setIsHistoryVisible}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="size-9 p-0"
            aria-label="Toggle history menu"
          >
            <HistoryIcon className="size-[1.2rem]" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[540px] p-0 bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 backdrop-blur-xl border-l border-zinc-200 dark:border-zinc-800"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-xl font-semibold text-zinc-900 dark:bg-gradient-to-r dark:from-white dark:to-zinc-400 dark:bg-clip-text dark:text-transparent">
                  History
                </div>
                <div className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {history === undefined ? "..." : history.length}
                </div>
              </div>
            </div>
            {user && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-out hover:scale-105 w-full"
                onClick={() => (window.location.href = "/")}
              >
                <PencilEditIcon size={14} />
                New Chat
              </Button>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col overflow-y-scroll h-[calc(100dvh-180px)] custom-scrollbar">
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <div className="size-16 rounded-full bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                    <div className="text-zinc-600 dark:text-zinc-400">
                      <InfoIcon />
                    </div>
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 text-sm max-w-[250px]">
                    Login to unlock your conversation history and pick up right
                    where you left off
                  </div>
                </div>
              ) : null}

              {!isLoading && history?.length === 0 && user ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <div className="size-16 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center">
                    <div className="text-zinc-400">
                      <InfoIcon />
                    </div>
                  </div>
                  <div className="text-zinc-400 text-sm max-w-[250px]">
                    Start your first conversation and it will appear here
                  </div>
                </div>
              ) : null}

              {isLoading && user ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="p-4 rounded-lg bg-zinc-800/50 animate-pulse">
                      <div className="h-4 bg-zinc-700 rounded w-3/4" />
                      <div className="h-3 bg-zinc-700/50 rounded w-1/2 mt-2" />
                    </div>
                  ))}
                </div>
              ) : null}

              {history &&
                history.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className={cx(
                      "group p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200",
                      {
                        "bg-zinc-100 dark:bg-zinc-800/80 shadow-lg": id === chat.id,
                      }
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          {getTitleFromChat(chat)}
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-500">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <DropdownMenu modal={true}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="size-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            variant="ghost"
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="left"
                          className="z-[60] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl"
                        >
                          <DropdownMenuItem asChild>
                            <Button
                              className="flex flex-row gap-2 items-center justify-start w-full h-fit font-normal p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault();
                                setDeleteId(chat.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <TrashIcon />
                              <span>Delete</span>
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
