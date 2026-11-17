"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PasteFeed } from "@/components/discovery/paste-feed";
import { Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const lang = searchParams.get("language") || undefined;

  return <PasteFeed initialQuery={query} initialLanguage={lang} />;
}

export default function SearchPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-enter delay-1">
      <div className="pb-4 border-b border-white/10 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Search Pastes
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Search across public paste titles, syntax grammars, and snippet content.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
            <p className="text-sm text-muted">Initializing search...</p>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
