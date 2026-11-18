"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/lib/api/collections";
import { CollectionDetailView } from "@/components/collections/collection-detail-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { id } = use(params);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["collection-detail", id],
    queryFn: () => getCollection(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
        <p className="text-sm text-muted">Loading collection...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto py-16 animate-enter">
        <Card className="p-6 text-center">
          <CardContent className="pt-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Collection Not Found</h2>
            <p className="text-sm text-muted">
              {(error as Error)?.message || "This collection is private or does not exist."}
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/collections" className="gap-1.5">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Collections
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-enter">
      <div className="pb-2">
        <Button asChild variant="ghost" size="sm" className="text-muted hover:text-foreground -ml-2 gap-1.5">
          <Link href="/collections">
            <ArrowLeft className="h-4 w-4" />
            Collections
          </Link>
        </Button>
      </div>

      <CollectionDetailView initialData={data} onRefresh={() => refetch()} />
    </div>
  );
}
