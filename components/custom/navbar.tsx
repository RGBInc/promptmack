import React from "react";
import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";

import { History } from "./history";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import { VisualModeToggle } from "./visual-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Navbar = async () => {
  const session = await auth();

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 bg-white/60 dark:bg-background/60 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/images/promptmack-logo.svg"
                height={36}
                width={36}
                alt="promptmack logo"
                className="hover:scale-110 transition-all duration-300 ease-out sm:size-10"
              />
              <span className="text-lg font-bold tracking-tight -ml-1 font-inter bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent hidden sm:inline transition-colors duration-300">Promptmack</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <History user={session?.user} />
            <VisualModeToggle />
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="py-1.5 px-2 h-fit font-normal flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                    variant="ghost"
                  >
                    <div className="size-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-md hover:shadow-lg transition-shadow">
                      {session.user?.email?.[0].toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-default">
                    <span className="text-sm text-muted-foreground truncate">{session.user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-1 z-50">
                    <form
                      className="w-full"
                      action={async () => {
                        "use server";

                        await signOut({
                          redirectTo: "/",
                        });
                      }}
                    >
                      <button
                        type="submit"
                        className="w-full text-left px-2 py-1.5 text-red-500 hover:text-red-400 transition-colors rounded hover:bg-red-950/30"
                      >
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="py-2 px-4 h-fit font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
