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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted">Username</Label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-foreground font-mono">
            <User className="h-4 w-4 text-muted" />
            <span>@{user?.username}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted">Email Address</Label>
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-foreground">
            <span className="flex items-center gap-2 truncate">
              <Mail className="h-4 w-4 text-muted shrink-0" />
              {user?.email}
            </span>
            {user?.emailVerified && (
              <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-muted shrink-0">
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
          <Label htmlFor="prof-name" className="text-xs text-muted">Display Name</Label>
          <Input
            id="prof-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name or nickname"
            className="text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-bio" className="text-xs text-muted">Bio</Label>
          <Textarea
            id="prof-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short note about yourself..."
            rows={3}
            className="text-sm resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-website" className="text-xs text-muted">Website or GitHub</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted" />
            <Input
              id="prof-website"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="pl-9 text-sm font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-avatar" className="text-xs text-muted">Avatar Image URL</Label>
          <Input
            id="prof-avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://avatars.githubusercontent.com/..."
            className="text-sm font-mono"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile
        </Button>
      </div>
    </form>
  );
}
