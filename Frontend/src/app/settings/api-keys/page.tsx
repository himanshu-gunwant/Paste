"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ApiKeysManager } from "@/components/settings/api-keys-manager";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, User, Key, Laptop } from "lucide-react";

export default function ApiKeysPage() {
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
        <h2 className="text-xl font-bold text-zinc-100">Sign in to view API Keys</h2>
        <div className="pt-2">
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-8">
      {/* Settings Navigation */}
      <div className="flex flex-col gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Account Settings</h1>
          <p className="text-sm text-zinc-400">
            Manage your personal profile, credentials, sessions, and security parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-400 hover:text-white">
            <Link href="/settings">
              <User className="h-3.5 w-3.5" /> Profile
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-zinc-400 hover:text-white">
            <Link href="/settings/sessions">
              <Laptop className="h-3.5 w-3.5" /> Sessions
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Link href="/settings/api-keys">
              <Key className="h-3.5 w-3.5" /> API Keys
            </Link>
          </Button>
        </div>
      </div>

      <ApiKeysManager />
    </div>
  );
}
