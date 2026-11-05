"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/lib/api/auth";
import { getUserPublicPastes, getUserPublicCollections } from "@/lib/api/discovery";
import { PasteCard } from "@/components/discovery/paste-card";
import { CollectionCard } from "@/components/collections/collection-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Globe,
  FileText,
  Folder,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const [tab, setTab] = useState<"pastes" | "collections">("pastes");

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => getPublicProfile(username),
  });

  const { data: pastesData, isLoading: isPastesLoading } = useQuery({
    queryKey: ["user-public-pastes", username],
    queryFn: () => getUserPublicPastes(username, { limit: 50 }),
  });

  const { data: collections, isLoading: isCollectionsLoading } = useQuery({
    queryKey: ["user-public-collections", username],
    queryFn: () => getUserPublicCollections(username),
  });

  const pastes = pastesData?.data || [];

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Card className="bg-zinc-900/60 border-zinc-800 p-6 text-center">
          <CardContent className="pt-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">User Not Found</h2>
            <p className="text-sm text-zinc-400">
              No developer profile was found matching @{username}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-4 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-xl border border-zinc-800/80 bg-zinc-950/60">
        <Avatar className="h-20 w-20 border-2 border-violet-500/30">
          <AvatarImage src={profile.avatarUrl || undefined} alt={profile.username} />
          <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xl font-bold">
            {profile.displayName?.slice(0, 2).toUpperCase() || profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              {profile.displayName || profile.username}
            </h1>
            <Badge variant="outline" className="font-mono text-xs text-zinc-400 border-zinc-800">
              @{profile.username}
            </Badge>
          </div>

          {profile.bio && (
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </span>

            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-violet-400 hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                {profile.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="pastes" className="gap-2 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Public Pastes ({pastes.length})
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2 text-xs">
              <Folder className="h-3.5 w-3.5" />
              Public Collections ({collections?.length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "pastes" && (
          <div>
            {isPastesLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                <p className="text-xs text-zinc-400">Loading pastes...</p>
              </div>
            ) : pastes.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                @{profile.username} hasn&apos;t published any public pastes yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastes.map((p) => (
                  <PasteCard key={p.id} paste={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "collections" && (
          <div>
            {isCollectionsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                <p className="text-xs text-zinc-400">Loading collections...</p>
              </div>
            ) : !collections || collections.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                @{profile.username} hasn&apos;t created any public collections yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((col) => (
                  <CollectionCard key={col.id} collection={col} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
