"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Terminal,
  Menu,
  Compass,
  FileCode,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-2.5 sm:px-6">
        <div className="flex items-center gap-1.5 sm:gap-6">
          {/* Mobile Menu Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 shrink-0"
                aria-label="Open mobile menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-[#141414] border-white/10 p-5">
              <SheetHeader className="text-left pb-4 border-b border-white/10">
                <SheetTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-foreground ring-1 ring-white/15">
                    <Terminal className="h-3 w-3" />
                  </div>
                  <span>paste.himanshugunwant.com</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 pt-4 text-sm">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors",
                    pathname === "/" || pathname === "/new"
                      ? "bg-white/10 text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Editor</span>
                </Link>
                <Link
                  href="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors",
                    pathname.startsWith("/explore")
                      ? "bg-white/10 text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore</span>
                </Link>
                <Link
                  href="/languages"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors",
                    pathname.startsWith("/languages")
                      ? "bg-white/10 text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <FileCode className="h-4 w-4" />
                  <span>Languages</span>
                </Link>
                <div className="pt-3 mt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("open-command-palette"));
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </span>
                    <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded font-mono text-zinc-400 border border-white/10">
                      ⌘K
                    </kbd>
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-sm tracking-tight text-foreground hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded shrink-0"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-foreground ring-1 ring-white/15">
              <Terminal className="h-3 w-3" />
            </div>
            <span>
              paste<span className="hidden sm:inline text-zinc-400 font-normal">.himanshugunwant.com</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
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

        {/* Right side controls */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile/Tablet search button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="md:hidden h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 shrink-0"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>

          {/* Desktop search button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="hidden md:flex h-8 gap-2 text-xs border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/5 px-2.5 rounded-md focus-visible:ring-1 focus-visible:ring-white/30"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-[11px]">Search...</span>
            <kbd className="ml-1 text-[10px] bg-white/5 px-1 py-0.5 rounded font-mono text-zinc-400 border border-white/10">
              ⌘K
            </kbd>
          </Button>

          {/* New Paste button */}
          <Link href="/new">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs border-white/10 bg-white/[0.02] hover:bg-white/5 text-foreground hover:text-white px-2 sm:px-3"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden xs:inline">New Paste</span>
              <span className="xs:hidden">New</span>
            </Button>
          </Link>

          <div className="h-4 w-[1px] bg-white/10 hidden xs:block" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
