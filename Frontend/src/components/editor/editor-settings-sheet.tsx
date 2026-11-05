"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Eye, Lock, Globe, FileText } from "lucide-react";

interface EditorSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  customSlug: string;
  onCustomSlugChange: (val: string) => void;
  password?: string;
  onPasswordChange: (val: string) => void;
  burnAfterRead: boolean;
  onBurnAfterReadChange: (val: boolean) => void;
  maxViews: string;
  onMaxViewsChange: (val: string) => void;
  customExpiresAt: string;
  onCustomExpiresAtChange: (val: string) => void;
}

export function EditorSettingsSheet({
  open,
  onOpenChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  customSlug,
  onCustomSlugChange,
  password = "",
  onPasswordChange,
  burnAfterRead,
  onBurnAfterReadChange,
  maxViews,
  onMaxViewsChange,
  customExpiresAt,
  onCustomExpiresAtChange,
}: EditorSettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto space-y-5 border-border bg-card">
        <SheetHeader>
          <SheetTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>Paste Options & Protection</span>
          </SheetTitle>
          <SheetDescription className="text-xs">
            Configure privacy, self-destruction, custom links, and metadata.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="paste-title">Title (optional)</Label>
            <Input
              id="paste-title"
              placeholder="e.g. Docker Compose for PostgreSQL 16"
              value={title}
              maxLength={140}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="paste-desc">Description (optional)</Label>
            <Textarea
              id="paste-desc"
              placeholder="Add optional notes, context, or instructions..."
              value={description}
              maxLength={500}
              className="resize-none h-18 text-xs"
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>

          {/* Custom Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <Label htmlFor="custom-slug">Custom Link Slug (optional)</Label>
            </div>
            <div className="flex items-center">
              <span className="flex h-9 items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-xs text-muted-foreground select-none">
                paste.bin/p/
              </span>
              <Input
                id="custom-slug"
                placeholder="my-cool-snippet"
                className="rounded-l-none"
                value={customSlug}
                onChange={(e) => onCustomSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                maxLength={64}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              3 to 64 letters, numbers, hyphens, and underscores.
            </p>
          </div>

          {/* Password Protection */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <Label htmlFor="paste-password">Password Protection (optional)</Label>
            </div>
            <Input
              id="paste-password"
              type="password"
              placeholder="Min 4 characters (Argon2id protected)"
              value={password}
              maxLength={128}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">
              Anyone with the link must supply this password to decrypt and view the content.
            </p>
          </div>

          {/* Burn After Read */}
          <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <Flame className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="burn-after-read" className="cursor-pointer text-xs font-semibold text-red-300">
                  Burn After Reading
                </Label>
                <input
                  type="checkbox"
                  id="burn-after-read"
                  checked={burnAfterRead}
                  onChange={(e) => onBurnAfterReadChange(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-red-400/80 leading-relaxed">
                The paste is destroyed from the database permanently immediately after the first view.
              </p>
            </div>
          </div>

          {/* Max Views */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
              <Label htmlFor="max-views">Maximum View Count (optional)</Label>
            </div>
            <Input
              id="max-views"
              type="number"
              placeholder="e.g. 5 (expires after 5 views)"
              value={maxViews}
              min={1}
              max={1000000}
              onChange={(e) => onMaxViewsChange(e.target.value)}
            />
          </div>

          {/* Custom Expiry Date */}
          <div className="space-y-1.5">
            <Label htmlFor="custom-expires">Custom Expiration Date/Time (optional)</Label>
            <Input
              id="custom-expires"
              type="datetime-local"
              value={customExpiresAt}
              onChange={(e) => onCustomExpiresAtChange(e.target.value)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
