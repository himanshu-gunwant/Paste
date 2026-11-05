import { Metadata } from "next";
import { PasteFeed } from "@/components/discovery/paste-feed";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Pastes",
  description: "Browse trending, popular, and recent public pastes from developers.",
};

export default function ExplorePage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-100">
          <Compass className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight">Explore Public Pastes</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Discover snippets, configurations, documents, and scripts shared with the developer community.
        </p>
      </div>

      {/* Interactive Feed */}
      <PasteFeed />
    </div>
  );
}
