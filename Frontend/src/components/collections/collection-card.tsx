"use client";

import Link from "next/link";
import { CollectionView } from "@/types/collection";
import { Badge } from "@/components/ui/badge";
import { Folder, Globe, Lock, Link as LinkIcon, Layers, ArrowUpRight } from "lucide-react";

interface CollectionCardProps {
  collection: CollectionView;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`} className="group block h-full">
      <div className="relative flex flex-col justify-between p-5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer h-full">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-white/5 border border-white/10 text-muted group-hover:text-foreground transition-colors">
                <Folder className="h-4 w-4" />
              </div>
              <h3 className="font-medium text-foreground group-hover:text-white transition-colors line-clamp-1">
                {collection.title}
              </h3>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              {collection.visibility === "public" && (
                <Badge variant="secondary" className="gap-1 text-[10px] border-white/10 bg-white/5 text-muted">
                  <Globe className="h-2.5 w-2.5" />
                  Public
                </Badge>
              )}
              {collection.visibility === "unlisted" && (
                <Badge variant="outline" className="gap-1 text-[10px] border-white/10 bg-white/5 text-muted">
                  <LinkIcon className="h-2.5 w-2.5" />
                  Unlisted
                </Badge>
              )}
              {collection.visibility === "private" && (
                <Badge variant="outline" className="gap-1 text-[10px] border-white/10 bg-white/5 text-muted">
                  <Lock className="h-2.5 w-2.5" />
                  Private
                </Badge>
              )}
              <ArrowUpRight className="h-3.5 w-3.5 text-muted/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>

          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {collection.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-muted/60" />
            <span>
              {typeof collection.itemCount === "number"
                ? `${collection.itemCount} ${collection.itemCount === 1 ? "paste" : "pastes"}`
                : "View items"}
            </span>
          </div>

          <span className="text-[11px] text-muted/60">
            Updated {new Date(collection.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
