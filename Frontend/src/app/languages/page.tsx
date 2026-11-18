"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "@/lib/api/discovery";
import { Loader2 } from "lucide-react";

export default function LanguagesPage() {
  const { data: languages, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => getLanguages(),
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-enter delay-1">
      <div className="pb-4 border-b border-white/10 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Languages & Grammars
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Explore snippets cataloged across languages, runtimes, and formats.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
          <p className="text-sm text-muted">Loading language directory...</p>
        </div>
      ) : !languages || languages.length === 0 ? (
        <div className="text-center py-16 text-muted text-sm">No language data recorded yet.</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {languages.map((facet) => (
            <Link key={facet.language} href={`/explore?language=${encodeURIComponent(facet.language)}`}>
              <div className="group p-3 sm:p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer flex items-baseline justify-between gap-2">
                <span className="font-mono text-sm font-medium text-foreground group-hover:text-white uppercase transition-colors truncate">
                  {facet.language}
                  <span className="inline-block ml-1 text-xs text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </span>
                <span className="text-xs text-zinc-400 font-mono shrink-0">
                  {facet.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
