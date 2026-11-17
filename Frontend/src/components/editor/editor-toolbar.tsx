"use client";

import { LanguageSelect } from "./language-select";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Link as LinkIcon,
  Lock,
  Clock,
  SlidersHorizontal,
  Flame,
  Check,
  Loader2,
} from "lucide-react";

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  detectedLanguage?: string | null;
  visibility: "public" | "unlisted" | "private";
  onVisibilityChange: (vis: "public" | "unlisted" | "private") => void;
  expiresIn: string;
  onExpiresInChange: (exp: string) => void;
  onOpenSettings: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasPassword?: boolean;
  burnAfterRead?: boolean;
  hasCustomSlug?: boolean;
}

export function EditorToolbar({
  language,
  onLanguageChange,
  detectedLanguage,
  visibility,
  onVisibilityChange,
  expiresIn,
  onExpiresInChange,
  onOpenSettings,
  onSubmit,
  isSubmitting,
  hasPassword,
  burnAfterRead,
  hasCustomSlug,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0f0f0f] px-3.5 py-2">
      {/* Left controls: Language, Visibility, Expiration */}
      <div className="flex flex-wrap items-center gap-2">
        <LanguageSelect
          value={language}
          onChange={onLanguageChange}
          detectedLanguage={detectedLanguage}
        />

        {/* Visibility */}
        <Select value={visibility} onValueChange={(val) => onVisibilityChange(val as "public" | "unlisted" | "private")}>
          <SelectTrigger className="h-8 w-[115px] text-xs gap-1.5 border-white/10 bg-white/[0.03] hover:bg-white/5 transition-colors">
            {visibility === "public" && <Globe className="h-3.5 w-3.5 text-emerald-400" />}
            {visibility === "unlisted" && <LinkIcon className="h-3.5 w-3.5 text-zinc-400" />}
            {visibility === "private" && <Lock className="h-3.5 w-3.5 text-amber-400" />}
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="public" className="text-xs">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>Public</span>
              </span>
            </SelectItem>
            <SelectItem value="unlisted" className="text-xs">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-zinc-400" />
                <span>Unlisted</span>
              </span>
            </SelectItem>
            <SelectItem value="private" className="text-xs">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Private</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Expiration */}
        <Select value={expiresIn} onValueChange={onExpiresInChange}>
          <SelectTrigger className="h-8 w-[115px] text-xs gap-1.5 border-white/10 bg-white/[0.03] hover:bg-white/5 transition-colors">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="never" className="text-xs">Never</SelectItem>
            <SelectItem value="10min" className="text-xs">10 Minutes</SelectItem>
            <SelectItem value="1h" className="text-xs">1 Hour</SelectItem>
            <SelectItem value="1d" className="text-xs">1 Day</SelectItem>
            <SelectItem value="1w" className="text-xs">1 Week</SelectItem>
            <SelectItem value="1m" className="text-xs">1 Month</SelectItem>
          </SelectContent>
        </Select>

        {/* Active features badges / Settings trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="h-8 text-xs gap-1.5 border-white/10 bg-white/[0.03] hover:bg-white/5 text-foreground hover:text-white transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
          <span>Options</span>
          {hasPassword && (
            <Badge variant="amber" className="h-4 px-1 text-[9px]">
              PWD
            </Badge>
          )}
          {burnAfterRead && (
            <Badge variant="destructive" className="h-4 px-1 text-[9px] gap-0.5">
              <Flame className="h-2.5 w-2.5" />
              <span>BURN</span>
            </Badge>
          )}
          {hasCustomSlug && (
            <Badge variant="violet" className="h-4 px-1 text-[9px]">
              SLUG
            </Badge>
          )}
        </Button>
      </div>

      {/* Right controls: Submit */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-8 gap-1.5 text-xs bg-foreground text-background hover:bg-white font-medium"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          <span>Create Paste</span>
          <kbd className="hidden sm:inline-block rounded bg-background/20 px-1 py-0.2 text-[10px] font-mono">
            ⌘↵
          </kbd>
        </Button>
      </div>
    </div>
  );
}
