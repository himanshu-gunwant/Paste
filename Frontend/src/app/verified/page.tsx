"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

function VerifiedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const isSuccess = status === "success";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-enter">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center pb-2">
            {isSuccess ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                <XCircle className="h-6 w-6" />
              </div>
            )}
          </div>
          <CardTitle className="text-lg">
            {isSuccess ? "Email Verified" : "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-xs">
            {isSuccess
              ? "Your email address has been verified. You now have full access to developer API keys and sharing features."
              : "This verification link is invalid, expired, or has already been used."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Link href={isSuccess ? "/dashboard" : "/login"}>
            <Button className="w-full text-xs">
              {isSuccess ? "Go to Dashboard" : "Back to Sign In"}
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/10 pt-4 text-xs text-muted">
          <Link href="/" className="hover:underline text-foreground">
            Return to paste.himanshugunwant.com
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-muted">Verifying...</div>}>
      <VerifiedContent />
    </Suspense>
  );
}
