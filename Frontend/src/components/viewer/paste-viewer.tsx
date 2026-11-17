"use client";

import { useState, useMemo } from "react";
import { PasteView } from "@/types/paste";
import { useAuth } from "@/hooks/use-auth";
import { usePasteVault } from "@/hooks/use-paste-vault";
import { PasteHeader } from "./paste-header";
import { PasteActions } from "./paste-actions";
import { BurnNotice } from "./burn-notice";
import { CodeEditor } from "@/components/editor/code-editor";
import { MarkdownView } from "./markdown-view";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye } from "lucide-react";

interface PasteViewerProps {
  paste: PasteView;
  initialContent?: string;
  shareToken?: string;
  managementToken?: string;
}

export function PasteViewer({
  paste,
  initialContent = "",
  shareToken,
  managementToken: propToken,
}: PasteViewerProps) {
  const { user } = useAuth();
  const { getToken } = usePasteVault();

  // Find effective management token (prop token or from anonymous vault)
  const managementToken = useMemo(() => {
    return propToken || getToken(paste.id) || undefined;
  }, [propToken, getToken, paste.id]);

  // Determine ownership/management permissions
  const isOwner = Boolean(
    user?.username && paste.author?.username && user.username.toLowerCase() === paste.author.username.toLowerCase()
  );
  const canManage = isOwner || Boolean(managementToken);

  const content = paste.content ?? initialContent;
  const lineCount = useMemo(() => {
    return content ? content.split("\n").length : 0;
  }, [content]);

  const isMarkdown = (paste.language || paste.detectedLanguage) === "markdown";
  const [tab, setTab] = useState<"code" | "preview">(isMarkdown ? "preview" : "code");

  return (
    <div className="flex flex-col gap-6 animate-enter delay-1">
      {/* Burned Notice if applicable */}
      {paste.burnAfterRead && <BurnNotice burnedAt={paste.burnedAt} />}

      {/* Header with Title, Author, Date, Stats */}
      <PasteHeader paste={paste} lineCount={lineCount} />

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Markdown Tab Switcher if markdown */}
        {isMarkdown ? (
          <Tabs
            value={tab}
            onValueChange={(val) => setTab(val as "code" | "preview")}
            className="w-auto"
          >
            <TabsList className="bg-white/[0.03] border border-white/10">
              <TabsTrigger value="preview" className="gap-1.5 text-xs">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5 text-xs">
                <Code className="h-3.5 w-3.5" />
                Raw / Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <div />
        )}

        {/* Global actions: Copy, Raw, Download, Fork, Edit, Delete, Share, Bookmark, History, Report */}
        <PasteActions
          pasteId={paste.id}
          content={content}
          isOwner={isOwner}
          canManage={canManage}
          managementToken={managementToken}
          shareToken={shareToken}
          isPrivate={paste.visibility === "private"}
          hasRevisions={true}
        />
      </div>

      {/* Code or Markdown Display */}
      <div className="rounded-lg border border-white/10 bg-[#0f0f0f] overflow-hidden">
        {isMarkdown && tab === "preview" ? (
          <div className="p-6">
            <MarkdownView content={content} />
          </div>
        ) : (
          <div className="min-h-[350px]">
            <CodeEditor
              value={content}
              language={paste.language || paste.detectedLanguage || "plaintext"}
              readOnly={true}
              autoFocus={false}
              className="font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
