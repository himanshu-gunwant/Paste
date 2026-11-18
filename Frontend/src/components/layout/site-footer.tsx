"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0f0f0f] py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs text-zinc-400">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-3 sm:px-4 w-full">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono">paste.himanshugunwant.com</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a
            href="https://himanshugunwant.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded inline-flex items-center gap-0.5"
          >
            <span>himanshugunwant.com</span>
            <span className="text-[10px] text-zinc-500">↗</span>
          </a>
          <span className="text-zinc-600">·</span>
          <Link
            href="/explore"
            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
          >
            Explore
          </Link>
          <span className="text-zinc-600">·</span>
          <Link
            href="/languages"
            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
          >
            Languages
          </Link>
          <span className="text-zinc-600">·</span>
          <a
            href="https://github.com/himanshu-gunwant/Paste"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded inline-flex items-center gap-0.5"
          >
            <span>GitHub</span>
            <span className="text-[10px] text-zinc-500">↗</span>
          </a>
          <span className="text-zinc-600">·</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="font-mono text-zinc-400 hover:text-white text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded"
          >
            ⌘K
          </button>
        </div>
      </div>
    </footer>
  );
}
