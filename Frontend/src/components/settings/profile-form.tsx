"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { updateMe } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Loader2, CheckCircle2, User, Globe, Mail } from "lucide-react";

export function ProfileForm() {
  const { user, refetchUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateMe({
        displayName: displayName.trim() || null,
        bio: bio.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
      });

      await refetchUser();
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Account Info Readonly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-400">Username</Label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 font-mono">
            <User className="h-4 w-4 text-zinc-500" />
            <span>@{user?.username}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-zinc-400">Email Address</Label>
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
            <span className="flex items-center gap-2 truncate">
              <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
              {user?.email}
            </span>
            {user?.emailVerified && (
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-900/60 shrink-0">
                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="prof-name" className="text-xs text-zinc-300">Display Name</Label>
          <Input
            id="prof-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name or nickname"
            className="bg-zinc-900 border-zinc-800 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-bio" className="text-xs text-zinc-300">Bio</Label>
          <Textarea
            id="prof-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short note about yourself..."
            rows={3}
            className="bg-zinc-900 border-zinc-800 text-sm resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-website" className="text-xs text-zinc-300">Website or GitHub</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              id="prof-website"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="pl-9 bg-zinc-900 border-zinc-800 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-avatar" className="text-xs text-zinc-300">Avatar Image URL</Label>
          <Input
            id="prof-avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://avatars.githubusercontent.com/..."
            className="bg-zinc-900 border-zinc-800 text-sm font-mono"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </Button>
      </div>
    </form>
  );
}
