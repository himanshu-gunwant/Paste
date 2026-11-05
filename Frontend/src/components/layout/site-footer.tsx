import Link from "next/link";
import { Terminal } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-4 text-xs text-muted-foreground">
      <div className="container max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span>paste.bin — developer code sharing platform</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <a
            href="/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Swagger API
          </a>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-zinc-500">Press ⌘K for command palette</span>
        </div>
      </div>
    </footer>
  );
}
