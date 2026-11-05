"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { Button } from "@/components/ui/button";
import { Plus, Compass, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground hover:opacity-90">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span>paste<span className="text-primary font-bold">.bin</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs">
            <Link
              href="/"
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-colors",
                pathname === "/" || pathname === "/new"
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Editor
            </Link>
            <Link
              href="/explore"
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5",
                pathname.startsWith("/explore")
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Explore</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/new">
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs border-border bg-subtle hover:bg-muted text-foreground">
              <Plus className="h-3.5 w-3.5" />
              <span>New Paste</span>
            </Button>
          </Link>

          <div className="h-4 w-[1px] bg-border" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
