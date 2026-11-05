"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PasteFeed } from "@/components/discovery/paste-feed";
import { Search, Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const lang = searchParams.get("language") || undefined;

  return <PasteFeed initialQuery={query} initialLanguage={lang} />;
}

export default function SearchPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-100">
          <Search className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight">Search Pastes</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Search across public paste titles, syntax grammars, and snippet content.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm text-zinc-400">Initializing search...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
