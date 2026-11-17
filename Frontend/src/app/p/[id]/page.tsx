"use client";

import { use, useEffect, useState } from "react";
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

  useEffect(() => {
    let isCancelled = false;

    async function load() {
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

        if (!isCancelled) {
          setPaste(data);
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        const anyErr = err as {
          statusCode?: number;
          code?: string;
          message?: string;
          response?: { status?: number; data?: { error?: { code?: string; message?: string } } };
        };
        const status = anyErr.statusCode || anyErr.response?.status || 500;
        const code = anyErr.code || anyErr.response?.data?.error?.code || "UNKNOWN";
        const msg = anyErr.response?.data?.error?.message || anyErr.message || "Failed to load paste";

        if (status === 401 && (code === "PASSWORD_REQUIRED" || msg.toLowerCase().includes("password"))) {
          setIsPasswordRequired(true);
          setErrorStatus(null);
          setErrorMessage(null);
        } else {
          setErrorStatus(status);
          setErrorMessage(msg);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [id, shareToken, paramManagementToken, getToken]);

  const handleUnlocked = (unlocked: PasteView) => {
    setPaste(unlocked);
    setIsPasswordRequired(false);
    setErrorStatus(null);
    setErrorMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
        <p className="text-sm text-muted">Loading paste...</p>
      </div>
    );
  }

  // Password required gate
  if (isPasswordRequired) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <PasswordGate pasteId={id} shareToken={shareToken} onUnlocked={handleUnlocked} />
      </div>
    );
  }

  // Error view (404, 410, 403, etc.)
  if (errorStatus && !paste) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <Card className="bg-white/[0.02] border-white/10 p-6 text-center rounded-xl">
          <CardContent className="pt-6 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {errorStatus === 404
                ? "Paste Not Found"
                : errorStatus === 410
                ? "Paste Expired or Burned"
                : "Unable to Access Paste"}
            </h2>
            <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
              {errorMessage || "This paste may have expired, been burned, or removed by its creator."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-3">
              <Button asChild variant="outline" size="sm" className="border-white/10 text-foreground hover:bg-white/5">
                <Link href="/" className="gap-1.5">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-foreground text-background font-medium hover:bg-white">
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <PasteViewer
        paste={paste}
        initialContent={paste.content}
        shareToken={shareToken}
        managementToken={paramManagementToken}
      />
    </div>
  );
}
