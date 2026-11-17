"use client";

import { useAuth } from "@/hooks/use-auth";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in to access Dashboard</h2>
        <p className="text-sm text-muted">
          Your personal developer dashboard provides paste metrics, activity overviews, and management controls.
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
    <div className="w-full max-w-5xl mx-auto py-4">
      <DashboardOverview />
    </div>
  );
}
