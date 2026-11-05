"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPublicPastes, searchPublicPastes } from "@/lib/api/discovery";
import { PasteCard } from "./paste-card";
import { SearchBar } from "./search-bar";
import { LanguageFacets } from "./language-facets";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, TrendingUp, Clock, Flame, FileText } from "lucide-react";

interface PasteFeedProps {
  initialSort?: "latest" | "popular" | "trending";
  initialLanguage?: string;
  initialQuery?: string;
  authorUsername?: string;
  hideHeaderControls?: boolean;
}

export function PasteFeed({
  initialSort = "latest",
  initialLanguage,
  initialQuery = "",
  authorUsername,
  hideHeaderControls = false,
}: PasteFeedProps) {
  const [sort, setSort] = useState<"latest" | "popular" | "trending">(initialSort);
  const [language, setLanguage] = useState<string | undefined>(initialLanguage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const isSearching = searchQuery.trim().length > 0;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["pastes-feed", sort, language, searchQuery, authorUsername],
    queryFn: async ({ pageParam }) => {
      if (isSearching) {
        return await searchPublicPastes({
          q: searchQuery.trim(),
          language,
          username: authorUsername,
          cursor: pageParam as string | undefined,
        });
      } else {
        return await getPublicPastes({
          sort,
          language,
          username: authorUsername,
          cursor: pageParam as string | undefined,
        });
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore ? lastPage.pagination.cursor : undefined,
  });

  const allPastes = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Header */}
      {!hideHeaderControls && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search pastes by title, content..."
              />
            </div>

            {/* Sort Tabs (hidden when actively searching) */}
            {!isSearching && (
              <Tabs
                value={sort}
                onValueChange={(val) => setSort(val as typeof sort)}
                className="w-auto"
              >
                <TabsList className="bg-zinc-900 border border-zinc-800">
                  <TabsTrigger value="latest" className="gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    Latest
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="gap-1.5 text-xs">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="gap-1.5 text-xs">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                    Trending
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Language Facets */}
          <LanguageFacets
            selectedLanguage={language}
            onSelectLanguage={setLanguage}
          />
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-zinc-400">Loading public pastes...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16 border border-zinc-800/80 rounded-lg bg-zinc-900/30 p-8 space-y-3">
          <p className="text-sm text-rose-400">Failed to load pastes: {(error as Error)?.message || "Unknown error"}</p>
        </div>
      ) : allPastes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-800/60 rounded-xl bg-zinc-900/20 p-8 space-y-3">
          <div className="p-3 rounded-full bg-zinc-800/60 text-zinc-400">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-medium text-zinc-200">No pastes found</h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            {isSearching
              ? `No pastes matched "${searchQuery}". Try a different search term or clear the language filter.`
              : "There are currently no public pastes matching this criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPastes.map((paste) => (
              <PasteCard key={paste.id} paste={paste} />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2 border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 px-6"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                    Loading more...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    Load More Pastes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
