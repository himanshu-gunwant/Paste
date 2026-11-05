"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "@/lib/api/discovery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode, Loader2, ArrowRight } from "lucide-react";

export default function LanguagesPage() {
  const { data: languages, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => getLanguages(),
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-100">
          <FileCode className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight">Languages & Grammars</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Explore snippets cataloged across languages, runtimes, and formats.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading language directory...</p>
        </div>
      ) : !languages || languages.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No language data recorded yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {languages.map((facet) => (
            <Link key={facet.language} href={`/explore?language=${encodeURIComponent(facet.language)}`}>
              <Card className="group bg-zinc-950/70 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-sm font-medium text-zinc-200 group-hover:text-violet-400 uppercase transition-colors">
                      {facet.language}
                    </span>
                    <p className="text-xs text-zinc-500">
                      {facet.count} {facet.count === 1 ? "paste" : "pastes"}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-zinc-800 group-hover:border-zinc-700">
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
