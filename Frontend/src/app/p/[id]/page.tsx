"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPaste } from "@/lib/api/pastes";
import { PasteView } from "@/types/paste";
import { usePasteVault } from "@/hooks/use-paste-vault";
import { PasteViewer } from "@/components/viewer/paste-viewer";
import { PasswordGate } from "@/components/viewer/password-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, FilePlus, Home } from "lucide-react";

interface PastePageProps {
  params: Promise<{ id: string }>;
}

export default function PastePage({ params }: PastePageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const { getToken } = usePasteVault();

  const shareToken = searchParams.get("share_token") || undefined;
  const paramManagementToken = searchParams.get("token") || undefined;

  const [paste, setPaste] = useState<PasteView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  const fetchPaste = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorStatus(null);
      setErrorMessage(null);
      setIsPasswordRequired(false);

      const vaultToken = getToken(id);
      const effectiveToken = paramManagementToken || vaultToken;

      const data = await getPaste(id, {
        shareToken,
        managementToken: effectiveToken,
      });

      setPaste(data);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { error?: { code?: string; message?: string } } };
        message?: string;
      };
      const status = axiosErr.response?.status;
      const code = axiosErr.response?.data?.error?.code;
      const msg = axiosErr.response?.data?.error?.message || axiosErr.message || "Failed to load paste";

      setErrorStatus(status || 500);
      setErrorMessage(msg);

      if (status === 401 && (code === "PASSWORD_REQUIRED" || msg.toLowerCase().includes("password"))) {
        setIsPasswordRequired(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, shareToken, paramManagementToken, getToken]);

  useEffect(() => {
    fetchPaste();
  }, [fetchPaste]);

  const handleUnlocked = (unlocked: PasteView) => {
    setPaste(unlocked);
    setIsPasswordRequired(false);
    setErrorStatus(null);
    setErrorMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-zinc-400">Loading paste...</p>
      </div>
    );
  }

  // Password required gate
  if (isPasswordRequired) {
    return (
      <div className="max-w-md mx-auto py-12">
        <PasswordGate pasteId={id} shareToken={shareToken} onUnlocked={handleUnlocked} />
      </div>
    );
  }

  // Error view (404, 410, 403, etc.)
  if (errorStatus && !paste) {
    return (
      <div className="max-w-lg mx-auto py-16">
        <Card className="bg-zinc-900/60 border-zinc-800 p-6 text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">
              {errorStatus === 404
                ? "Paste Not Found"
                : errorStatus === 410
                ? "Paste Expired or Burned"
                : "Unable to Access Paste"}
            </h2>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              {errorMessage || "This paste may have expired, been burned, or removed by its creator."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button asChild variant="outline" size="sm" className="border-zinc-800">
                <Link href="/" className="gap-1.5">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                <Link href="/new" className="gap-1.5">
                  <FilePlus className="h-4 w-4" />
                  Create Paste
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paste) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      <PasteViewer
        paste={paste}
        initialContent={paste.content}
        shareToken={shareToken}
        managementToken={paramManagementToken}
      />
    </div>
  );
}
