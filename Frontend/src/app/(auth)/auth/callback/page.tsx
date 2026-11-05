"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const status = searchParams.get("status");

  useEffect(() => {
    // Invalidate auth query to pick up newly set session cookie
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] }).then(() => {
      if (status === "created") {
        toast.success("Account created and signed in via OAuth!");
      } else if (status === "linked") {
        toast.success("OAuth account successfully linked!");
      } else {
        toast.success("Signed in successfully!");
      }
      router.replace("/dashboard");
    });
  }, [router, queryClient, status]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-xs text-muted-foreground">Completing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="h-32 flex items-center justify-center text-xs text-muted-foreground">Authenticating...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
