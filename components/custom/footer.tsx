"use client";

import Link from 'next/link'
import React from 'react'
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function Footer() {
  return (
    <div className="fixed bottom-0 w-full flex justify-center items-center px-4 py-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span>Promptmack can make mistakes</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-6">
              <Info className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/terms">Terms</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/privacy">Privacy</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="" target="_blank">Company</Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
