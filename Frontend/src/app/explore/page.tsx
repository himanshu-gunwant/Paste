import { Metadata } from "next";
import { PasteFeed } from "@/components/discovery/paste-feed";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse trending, popular, and recent public pastes from developers.",
};

export default function ExplorePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-enter delay-1">
      {/* Page Header */}
      <div className="pb-4 border-b border-white/10 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Explore Public Pastes
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Discover snippets, configurations, documents, and scripts shared with the developer community.
        </p>
      </div>

      {/* Interactive Feed */}
      <PasteFeed />
    </div>
  );
}
