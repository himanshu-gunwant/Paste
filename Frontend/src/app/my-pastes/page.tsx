"use client";

import { useAuth } from "@/hooks/use-auth";
import { MyPastesTable } from "@/components/dashboard/my-pastes-table";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function MyPastesPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 animate-enter">
        <div className="p-3 rounded-full border border-white/10 bg-white/5 text-muted inline-flex">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in to view My Pastes</h2>
        <p className="text-sm text-muted">
          Sign in to access your account pastes and manage your saved browser vault items.
        </p>
        <div className="pt-2">
          <Button asChild size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-6 animate-enter">
      <div className="flex flex-col gap-1 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 text-foreground">
          <FileText className="h-5 w-5 text-muted" />
          <h1 className="text-2xl font-bold tracking-tight">My Pastes</h1>
        </div>
        <p className="text-sm text-muted">
          Manage your account pastes, edit content, and inspect browser vault tokens.
        </p>
      </div>

      <MyPastesTable />
    </div>
  );
}
