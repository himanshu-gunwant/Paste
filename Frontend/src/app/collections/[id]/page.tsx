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
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-zinc-400">Loading collection...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Card className="bg-zinc-900/60 border-zinc-800 p-6 text-center">
          <CardContent className="pt-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">Collection Not Found</h2>
            <p className="text-sm text-zinc-400">
              {(error as Error)?.message || "This collection is private or does not exist."}
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="border-zinc-800">
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
    <div className="w-full max-w-7xl mx-auto py-4 space-y-6">
      <div className="pb-2">
        <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white -ml-2 gap-1.5">
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
