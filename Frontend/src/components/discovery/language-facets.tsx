"use client";

import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "@/lib/api/discovery";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface LanguageFacetsProps {
  selectedLanguage?: string;
  onSelectLanguage: (language?: string) => void;
}

export function LanguageFacets({
  selectedLanguage,
  onSelectLanguage,
}: LanguageFacetsProps) {
  const { data: languages, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => getLanguages(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-xs text-zinc-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading languages...</span>
      </div>
    );
  }

  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <Badge
        variant={!selectedLanguage ? "default" : "outline"}
        onClick={() => onSelectLanguage(undefined)}
        className={`cursor-pointer text-xs px-2.5 py-1 transition-colors ${
          !selectedLanguage
            ? "bg-violet-600 hover:bg-violet-700 text-white border-transparent"
            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
        }`}
      >
        All Languages
      </Badge>

      {languages.map((facet) => {
        const isSelected = selectedLanguage === facet.language;
        return (
          <Badge
            key={facet.language}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelectLanguage(isSelected ? undefined : facet.language)}
            className={`cursor-pointer text-xs px-2.5 py-1 gap-1.5 transition-colors font-mono ${
              isSelected
                ? "bg-violet-600 hover:bg-violet-700 text-white border-transparent"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            <span>{facet.language}</span>
            <span
              className={`text-[10px] px-1 py-0.2 rounded-full ${
                isSelected ? "bg-violet-800/80 text-violet-100" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {facet.count}
            </span>
          </Badge>
        );
      })}
    </div>
  );
}
