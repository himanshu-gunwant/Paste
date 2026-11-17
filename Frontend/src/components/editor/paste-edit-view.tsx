"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasteView, Visibility } from "@/types/paste";
import { updatePaste } from "@/lib/api/pastes";
import { CodeEditor } from "./code-editor";
import { LanguageSelect } from "./language-select";
import { EditorStatusbar } from "./editor-statusbar";
import { MarkdownView } from "@/components/viewer/markdown-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Save,
  SlidersHorizontal,
  ArrowLeft,
  Loader2,
  Lock,
  Globe,
  Link as LinkIcon,
  Eye,
  Code,
} from "lucide-react";

interface PasteEditViewProps {
  paste: PasteView;
  managementToken?: string;
}

export function PasteEditView({ paste, managementToken }: PasteEditViewProps) {
  const router = useRouter();

  // Form states initialized with existing paste values
  const [content, setContent] = useState(paste.content || "");
  const [title, setTitle] = useState(paste.title || "");
  const [description, setDescription] = useState(paste.description || "");
  const [language, setLanguage] = useState(paste.language || "plaintext");
  const [visibility, setVisibility] = useState<Visibility>(paste.visibility);
  const [password, setPassword] = useState("");
  const [expiresIn, setExpiresIn] = useState<"10min" | "1h" | "1d" | "1w" | "1m" | undefined>(undefined);
  const [maxViews, setMaxViews] = useState<number | undefined>(paste.maxViews || undefined);
  const [burnAfterRead, setBurnAfterRead] = useState(paste.burnAfterRead);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const isMarkdown = language === "markdown";

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Paste content cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePaste(
        paste.id,
        {
          content,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          language,
          visibility,
          password: password.trim() ? password : undefined,
          expiresIn,
          maxViews: maxViews ? Number(maxViews) : undefined,
          burnAfterRead,
        },
        managementToken
      );

      toast.success("Paste updated successfully");
      router.push(`/p/${paste.id}`);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to update paste";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-enter delay-1">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/p/${paste.id}`)}
            className="text-muted hover:text-foreground gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="text-sm font-semibold text-foreground">
            Editing {paste.title ? `"${paste.title}"` : `p/${paste.id}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings sheet trigger */}
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 border-white/10 bg-white/[0.02] hover:bg-white/5 text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Options
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#141414] border-white/10 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-foreground">Paste Settings</SheetTitle>
                <SheetDescription className="text-muted text-xs">
                  Modify metadata, privacy, expiration and security parameters.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title" className="text-xs text-foreground/90">Title</Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Optional title"
                    className="bg-white/[0.03] border-white/10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-desc" className="text-xs text-foreground/90">Description</Label>
                  <Textarea
                    id="edit-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description"
                    rows={3}
                    className="bg-white/[0.03] border-white/10 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-pwd" className="text-xs text-foreground/90">New Password</Label>
                  <Input
                    id="edit-pwd"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                    className="bg-white/[0.03] border-white/10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground/90">Reset Expiration</Label>
                  <Select
                    value={expiresIn || "keep"}
                    onValueChange={(val) => setExpiresIn(val === "keep" ? undefined : (val as typeof expiresIn))}
                  >
                    <SelectTrigger className="bg-white/[0.03] border-white/10 text-sm">
                      <SelectValue placeholder="Keep current expiration" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141414] border-white/10 text-foreground">
                      <SelectItem value="keep">Keep current</SelectItem>
                      <SelectItem value="10min">10 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-max-views" className="text-xs text-foreground/90">Max Views</Label>
                  <Input
                    id="edit-max-views"
                    type="number"
                    min={1}
                    value={maxViews ?? ""}
                    onChange={(e) => setMaxViews(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="No limit"
                    className="bg-white/[0.03] border-white/10 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-foreground">Burn after read</Label>
                    <p className="text-xs text-muted">Deletes immediately after being viewed</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={burnAfterRead}
                    onChange={(e) => setBurnAfterRead(e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-white/5 accent-white cursor-pointer"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Save button */}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting || !content.trim()}
            className="gap-1.5 bg-foreground text-background hover:bg-white font-medium"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Language, Visibility, Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2">
          <LanguageSelect value={language} onChange={setLanguage} />

          <Select value={visibility} onValueChange={(val) => setVisibility(val as Visibility)}>
            <SelectTrigger className="w-[125px] h-9 bg-white/[0.03] border-white/10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#141414] border-white/10 text-foreground">
              <SelectItem value="public">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  Public
                </span>
              </SelectItem>
              <SelectItem value="unlisted">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-amber-300" />
                  Unlisted
                </span>
              </SelectItem>
              <SelectItem value="private">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-rose-300" />
                  Private
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isMarkdown && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="text-xs gap-1.5 text-muted hover:text-foreground"
          >
            {previewMode ? (
              <>
                <Code className="h-3.5 w-3.5" /> Code
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" /> Preview
              </>
            )}
          </Button>
        )}
      </div>

      {/* Editor or Markdown Preview */}
      <div className="rounded-lg border border-white/10 bg-[#0f0f0f] overflow-hidden min-h-[400px]">
        {previewMode && isMarkdown ? (
          <div className="p-6">
            <MarkdownView content={content} />
          </div>
        ) : (
          <CodeEditor
            value={content}
            onChange={setContent}
            language={language}
            placeholder="Edit paste content..."
            autoFocus
          />
        )}
      </div>

      {/* Status bar */}
      <EditorStatusbar
        content={content}
        language={language}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        isPreview={previewMode}
      />
    </div>
  );
}
