"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPaste } from "@/lib/api/pastes";
import { PasteView } from "@/types/paste";
import { usePasteVault } from "@/hooks/use-paste-vault";
import { PasteEditView } from "@/components/editor/paste-edit-view";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

interface EditPastePageProps {
  params: Promise<{ id: string }>;
}

export default function EditPastePage({ params }: EditPastePageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken } = usePasteVault();

  const paramToken = searchParams.get("token") || undefined;
  const vaultToken = getToken(id);
  const effectiveToken = paramToken || vaultToken;

  const [paste, setPaste] = useState<PasteView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPaste(id, {
          managementToken: effectiveToken,
        });
        setPaste(data);
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || "Failed to load paste for editing";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, effectiveToken]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-zinc-400">Loading paste editor...</p>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Card className="bg-zinc-900/60 border-zinc-800 p-6 text-center">
          <CardContent className="pt-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">Cannot Edit Paste</h2>
            <p className="text-sm text-zinc-400">
              {error || "You do not have permission to edit this paste."}
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/p/${id}`)}
                className="gap-1.5 border-zinc-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Paste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      <PasteEditView paste={paste} managementToken={effectiveToken} />
    </div>
  );
}
