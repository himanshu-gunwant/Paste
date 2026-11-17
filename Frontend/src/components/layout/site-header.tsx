"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import { Plus, Search, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md">
      <div className="container flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-sm tracking-tight text-foreground hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-foreground ring-1 ring-white/15">
              <Terminal className="h-3 w-3" />
            </div>
            <span>
              paste<span className="text-zinc-400 font-normal">.himanshugunwant.com</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs">
            <Link
              href="/"
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                pathname === "/" || pathname === "/new"
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Editor
            </Link>
            <Link
              href="/explore"
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                pathname.startsWith("/explore")
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Explore
            </Link>
            <Link
              href="/languages"
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                pathname.startsWith("/languages")
                  ? "bg-white/10 text-white font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Languages
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="hidden sm:flex h-8 gap-2 text-xs border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/5 px-2.5 rounded-md focus-visible:ring-1 focus-visible:ring-white/30"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-[11px]">Search...</span>
            <kbd className="ml-1 text-[10px] bg-white/5 px-1 py-0.5 rounded font-mono text-zinc-400 border border-white/10">
              ⌘K
            </kbd>
          </Button>

          <Link href="/new">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs border-white/10 bg-white/[0.02] hover:bg-white/5 text-foreground hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Paste</span>
            </Button>
          </Link>

          <div className="h-4 w-[1px] bg-white/10" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
