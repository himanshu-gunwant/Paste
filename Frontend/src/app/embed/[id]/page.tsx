"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getPaste } from "@/lib/api/pastes";
import { PasteView } from "@/types/paste";
import { CodeEditor } from "@/components/editor/code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check, FileCode, Loader2, ExternalLink } from "lucide-react";

interface EmbedPageProps {
  params: Promise<{ id: string }>;
}

function EmbedContent({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme") || "dark";
  const [paste, setPaste] = useState<PasteView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getPaste(id);
        setPaste(data);
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || "Failed to load paste";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCopy = () => {
    if (!paste?.content) return;
    navigator.clipboard.writeText(paste.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-400 gap-2 text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
        <span>Loading embed...</span>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-500 text-xs p-4 text-center">
        {error || "Paste not available for embedding."}
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${theme === "light" ? "bg-white text-zinc-900" : "bg-zinc-950 text-zinc-100"}`}>
      {/* Embed Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/80 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="text-xs font-semibold truncate text-zinc-200">
            {paste.title || "Untitled Paste"}
          </span>
          <Badge variant="outline" className="font-mono text-[10px] uppercase border-zinc-700 text-zinc-400">
            <FileCode className="h-2.5 w-2.5 mr-1 text-violet-400" />
            {paste.language || "text"}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 text-[11px] px-2 text-zinc-400 hover:text-white"
          >
            {copied ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>

          <a
            href={`/p/${paste.id}`}
            target="_blank"
            rel="noreferrer"
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-auto bg-zinc-950">
        <CodeEditor
          value={paste.content || ""}
          language={paste.language || "plaintext"}
          readOnly={true}
          autoFocus={false}
          className="font-mono text-xs"
        />
      </div>

      {/* Minimalist Embed Footer */}
      <div className="flex items-center justify-between px-3 py-1 bg-zinc-900/90 border-t border-zinc-800 text-[10px] text-zinc-500 shrink-0">
        <span>{paste.contentSize} bytes</span>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-400 hover:text-violet-400 transition-colors font-medium"
        >
          Pastebin
        </a>
      </div>
    </div>
  );
}

export default function EmbedPage({ params }: EmbedPageProps) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-400 text-xs">
          Loading embed...
        </div>
      }
    >
      <EmbedContent id={id} />
    </Suspense>
  );
}
