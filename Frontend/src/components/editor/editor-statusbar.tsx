"use client";

import { formatBytes } from "@/lib/utils";
import { AlertTriangle, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorStatusbarProps {
  content: string;
  language: string;
  detectedLanguage?: string | null;
  isPreview?: boolean;
  onTogglePreview?: () => void;
}

export function EditorStatusbar({
  content,
  language,
  detectedLanguage,
  isPreview,
  onTogglePreview,
}: EditorStatusbarProps) {
  const lineCount = content ? content.split("\n").length : 0;
  const charCount = content.length;
  const byteSize = new TextEncoder().encode(content).length;
  const isNearLimit = byteSize > 900_000;
  const isExceeded = byteSize > 1_000_000;

  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-1.5 text-[11px] text-muted-foreground select-none">
      <div className="flex items-center gap-4">
        <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
        <span>{charCount} {charCount === 1 ? "char" : "chars"}</span>
        <span
          className={`flex items-center gap-1 ${
            isExceeded ? "text-red-400 font-semibold" : isNearLimit ? "text-amber-400 font-medium" : ""
          }`}
        >
          {(isNearLimit || isExceeded) && <AlertTriangle className="h-3 w-3" />}
          <span>{formatBytes(byteSize)} / 1 MB</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {language === "markdown" && onTogglePreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="h-6 px-2 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10"
          >
            {isPreview ? (
              <>
                <Edit3 className="h-3 w-3" />
                <span>Edit Code</span>
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                <span>Live Preview</span>
              </>
            )}
          </Button>
        )}

        {detectedLanguage && detectedLanguage !== language && (
          <span className="text-[10px] text-zinc-500">
            Detected: <strong className="text-zinc-400">{detectedLanguage}</strong>
          </span>
        )}
        <span className="font-mono uppercase text-[10px] tracking-wider text-zinc-400">{language}</span>
      </div>
    </div>
  );
}
