"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CodeEditor } from "./code-editor";
import { EditorToolbar } from "./editor-toolbar";
import { EditorStatusbar } from "./editor-statusbar";
import { EditorSettingsSheet } from "./editor-settings-sheet";
import { MarkdownView } from "@/components/viewer/markdown-view";
import { createPaste } from "@/lib/api/pastes";
import { detectLanguage } from "@/lib/editor/languages";
import { usePasteVault } from "@/hooks/use-paste-vault";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Key, Copy, Check, ArrowRight } from "lucide-react";

export function PasteCreator() {
  const router = useRouter();
  const { savePaste } = usePasteVault();

  // Core Editor State
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [hasManuallySetLanguage, setHasManuallySetLanguage] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Settings / Options State
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
  const [expiresIn, setExpiresIn] = useState<string>("never");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [password, setPassword] = useState("");
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [maxViews, setMaxViews] = useState("");
  const [customExpiresAt, setCustomExpiresAt] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAnonToken, setCreatedAnonToken] = useState<string | null>(null);
  const [createdPasteId, setCreatedPasteId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Run lightweight language heuristic on typing
  useEffect(() => {
    if (!hasManuallySetLanguage && content.length > 5) {
      const detected = detectLanguage(content);
      if (detected) {
        setDetectedLanguage(detected);
        setLanguage(detected);
      }
    }
  }, [content, hasManuallySetLanguage]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setHasManuallySetLanguage(true);
    if (newLang !== "markdown") {
      setIsPreview(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Paste content cannot be empty");
      return;
    }

    const byteSize = new TextEncoder().encode(content).length;
    if (byteSize > 1_000_000) {
      toast.error("Paste content exceeds the 1 MB limit");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        content,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        language: language !== "plaintext" ? language : undefined,
        visibility,
        password: password.trim() || undefined,
        expiresIn: expiresIn !== "never" ? (expiresIn as "10min" | "1h" | "1d" | "1w" | "1m") : undefined,
        expiresAt: customExpiresAt ? new Date(customExpiresAt).toISOString() : undefined,
        maxViews: maxViews ? parseInt(maxViews, 10) : undefined,
        burnAfterRead,
        customSlug: customSlug.trim() || undefined,
      };

      const idempotencyKey = crypto.randomUUID();
      const res = await createPaste(payload, { idempotencyKey });

      // Save anonymous management token to local vault if returned
      if (res.managementToken) {
        savePaste({
          id: res.paste.id,
          slug: res.paste.id,
          title: res.paste.title,
          managementToken: res.managementToken,
          createdAt: res.paste.createdAt,
        });
        setCreatedAnonToken(res.managementToken);
        setCreatedPasteId(res.paste.id);
      } else {
        toast.success("Paste created successfully!");
        router.push(`/p/${res.paste.id}`);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to create paste";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAnonToken = () => {
    if (createdAnonToken) {
      navigator.clipboard.writeText(createdAnonToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
      toast.success("Management token copied to clipboard");
    }
  };

  const handleProceedToPaste = () => {
    if (createdPasteId) {
      router.push(`/p/${createdPasteId}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem-3.5rem)] min-h-[500px]">
      {/* Top action toolbar */}
      <EditorToolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        detectedLanguage={detectedLanguage}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        expiresIn={expiresIn}
        onExpiresInChange={setExpiresIn}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        hasPassword={!!password.trim()}
        burnAfterRead={burnAfterRead}
        hasCustomSlug={!!customSlug.trim()}
      />

      {/* Editor & Preview Area */}
      <div className="flex-1 relative overflow-hidden bg-background">
        {isPreview && language === "markdown" ? (
          <div className="h-full overflow-y-auto bg-canvas">
            <MarkdownView content={content} />
          </div>
        ) : (
          <CodeEditor
            value={content}
            onChange={setContent}
            language={language}
            onSubmit={handleSubmit}
            className="h-full"
          />
        )}
      </div>

      {/* Bottom status bar */}
      <EditorStatusbar
        content={content}
        language={language}
        detectedLanguage={detectedLanguage}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
      />

      {/* Advanced Settings Slide-Over Drawer */}
      <EditorSettingsSheet
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        customSlug={customSlug}
        onCustomSlugChange={setCustomSlug}
        password={password}
        onPasswordChange={setPassword}
        burnAfterRead={burnAfterRead}
        onBurnAfterReadChange={setBurnAfterRead}
        maxViews={maxViews}
        onMaxViewsChange={setMaxViews}
        customExpiresAt={customExpiresAt}
        onCustomExpiresAtChange={setCustomExpiresAt}
      />

      {/* Anonymous Creation Management Token Modal */}
      <Dialog open={!!createdAnonToken} onOpenChange={() => handleProceedToPaste()}>
        <DialogContent className="sm:max-w-md border-border bg-card">
          <DialogHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary mb-2">
              <Key className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-semibold">Save your Management Token</DialogTitle>
            <DialogDescription className="text-xs">
              Because you are creating this paste anonymously, this token is your only proof of ownership.
              Save it to edit or delete your paste later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={createdAnonToken || ""}
                className="font-mono text-xs bg-canvas select-all"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyAnonToken}
                className="gap-1.5 shrink-0"
              >
                {copiedToken ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedToken ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <p className="text-[11px] text-zinc-500">
              This token has also been saved to your local browser storage for quick edits on this device.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button onClick={handleProceedToPaste} className="w-full text-xs gap-1.5">
              <span>View Your Paste</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
