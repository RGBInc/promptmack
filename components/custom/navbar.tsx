import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";

import { History } from "./history";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { VisualModeToggle } from "./visual-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MessageSquare, Terminal } from "lucide-react";

export const Navbar = async () => {
  let session = await auth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/promptmack-logo.svg"
                height={40}
                width={40}
                alt="promptmack logo"
                className="hover:scale-110 transition-transform"
              />
              <Logo />
              <span className="text-base font-semibold tracking-wide -ml-2 font-inter">Promptmack</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <History user={session?.user} />
            <VisualModeToggle />
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="py-1.5 px-2 h-fit font-normal flex items-center gap-2 hover:bg-transparent"
                    variant="ghost"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {session.user?.email?.[0].toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-default">
                    <span className="text-sm text-muted-foreground">{session.user?.email}</span>
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
                        className="w-full text-left px-1 py-0.5 text-red-500"
                      >
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="py-1.5 px-2 h-fit font-normal text-white" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
