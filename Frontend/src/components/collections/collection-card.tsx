"use client";

import Link from "next/link";
import { CollectionView } from "@/types/collection";
import { Badge } from "@/components/ui/badge";
import { Folder, Globe, Lock, Link as LinkIcon, Layers } from "lucide-react";

interface CollectionCardProps {
  collection: CollectionView;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <div className="group relative flex flex-col justify-between p-5 rounded-lg border border-zinc-800/80 bg-zinc-950/70 hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all cursor-pointer h-full">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-violet-950/40 border border-violet-800/40 text-violet-400 group-hover:bg-violet-900/50 transition-colors">
                <Folder className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">
                {collection.title}
              </h3>
            </div>

            <div className="shrink-0">
              {collection.visibility === "public" && (
                <Badge variant="secondary" className="gap-1 text-[10px] text-emerald-400">
                  <Globe className="h-2.5 w-2.5" />
                  Public
                </Badge>
              )}
              {collection.visibility === "unlisted" && (
                <Badge variant="outline" className="gap-1 text-[10px] text-amber-400 border-amber-900/60">
                  <LinkIcon className="h-2.5 w-2.5" />
                  Unlisted
                </Badge>
              )}
              {collection.visibility === "private" && (
                <Badge variant="outline" className="gap-1 text-[10px] text-rose-400 border-rose-900/60">
                  <Lock className="h-2.5 w-2.5" />
                  Private
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {collection.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-zinc-900 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-zinc-600" />
            <span>
              {typeof collection.itemCount === "number"
                ? `${collection.itemCount} ${collection.itemCount === 1 ? "paste" : "pastes"}`
                : "View items"}
            </span>
          </div>

          <span className="text-[11px] text-zinc-600">
            Updated {new Date(collection.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
