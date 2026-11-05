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
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="p-3 rounded-full bg-zinc-800 text-zinc-400 inline-flex">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-100">Sign in to view My Pastes</h2>
        <p className="text-sm text-zinc-400">
          Sign in to access your pastes and manage your saved anonymous vault items.
        </p>
        <div className="pt-2">
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 text-zinc-100">
          <FileText className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight">My Pastes</h1>
        </div>
        <p className="text-sm text-zinc-400">
          Manage your account pastes, edit content, and inspect browser vault tokens.
        </p>
      </div>

      <MyPastesTable />
    </div>
  );
}
