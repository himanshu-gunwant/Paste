"use client";

import { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePasteVault } from "@/hooks/use-paste-vault";
import { RevisionTimeline } from "@/components/revisions/revision-timeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History } from "lucide-react";

interface RevisionsPageProps {
  params: Promise<{ id: string }>;
}

export default function RevisionsPage({ params }: RevisionsPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = usePasteVault();

  const shareToken = searchParams.get("share_token") || undefined;
  const paramToken = searchParams.get("token") || undefined;
  const vaultToken = getToken(id);
  const effectiveToken = paramToken || vaultToken;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-enter delay-1">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/p/${id}`)}
            className="text-muted hover:text-foreground gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Paste
          </Button>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted" />
            <h1 className="text-xl font-semibold text-foreground">Revision History</h1>
            <span className="text-xs text-muted/80 font-mono">p/{id}</span>
          </div>
        </div>
      </div>

      {/* Main Revision Timeline & Diff View */}
      <RevisionTimeline
        pasteId={id}
        shareToken={shareToken}
        managementToken={effectiveToken}
        canManage={Boolean(effectiveToken)}
      />
    </div>
  );
}
