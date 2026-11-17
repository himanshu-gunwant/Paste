"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ProfileForm } from "@/components/settings/profile-form";
import { DangerZone } from "@/components/settings/danger-zone";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, User, Key, Laptop } from "lucide-react";

export default function SettingsPage() {
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
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in to manage Settings</h2>
        <div className="pt-2">
          <Button asChild size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-8 animate-enter">
      {/* Settings Navigation */}
      <div className="flex flex-col gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Settings</h1>
          <p className="text-sm text-muted">
            Manage your personal profile, credentials, sessions, and security parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button asChild variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Link href="/settings">
              <User className="h-3.5 w-3.5" /> Profile
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted hover:text-foreground">
            <Link href="/settings/sessions">
              <Laptop className="h-3.5 w-3.5" /> Sessions
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted hover:text-foreground">
            <Link href="/settings/api-keys">
              <Key className="h-3.5 w-3.5" /> API Keys
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Profile Form */}
      <ProfileForm />

      {/* Danger Zone */}
      <DangerZone />
    </div>
  );
}
