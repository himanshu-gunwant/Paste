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
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/p/${id}`)}
            className="text-zinc-400 hover:text-white gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Paste
          </Button>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold text-zinc-100">Revision History</h1>
            <span className="text-xs text-zinc-500 font-mono">p/{id}</span>
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
