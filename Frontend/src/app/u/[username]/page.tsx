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
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
        <p className="text-sm text-muted">Loading profile...</p>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="max-w-md mx-auto py-16 animate-enter">
        <Card className="p-6 text-center">
          <CardContent className="pt-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">User Not Found</h2>
            <p className="text-sm text-muted">
              No developer profile was found matching @{username}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-enter">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg border border-white/10 bg-white/[0.02]">
        <Avatar className="h-20 w-20 border border-white/20">
          <AvatarImage src={profile.avatarUrl || undefined} alt={profile.username} />
          <AvatarFallback className="bg-white/10 text-foreground text-xl font-bold">
            {profile.displayName?.slice(0, 2).toUpperCase() || profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {profile.displayName || profile.username}
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-white/10 bg-white/5 text-muted">
              @{profile.username}
            </Badge>
          </div>

          {profile.bio && (
            <p className="text-sm text-foreground/90 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </span>

            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-foreground hover:underline"
              >
                <Globe className="h-3.5 w-3.5 text-muted" />
                {profile.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <Tabs value={tab} onValueChange={(val) => setTab(val as typeof tab)}>
          <TabsList>
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
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
                <p className="text-xs text-muted">Loading pastes...</p>
              </div>
            ) : pastes.length === 0 ? (
              <div className="text-center py-16 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
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
                <Loader2 className="h-6 w-6 animate-spin text-muted" />
                <p className="text-xs text-muted">Loading collections...</p>
              </div>
            ) : !collections || collections.length === 0 ? (
              <div className="text-center py-16 text-muted text-sm border border-white/10 rounded-lg bg-white/[0.02]">
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
