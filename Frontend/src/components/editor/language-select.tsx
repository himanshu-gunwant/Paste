"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/lib/editor/languages";
import { Code2 } from "lucide-react";

interface LanguageSelectProps {
  value: string;
  onChange: (language: string) => void;
  detectedLanguage?: string | null;
}

export function LanguageSelect({ value, onChange, detectedLanguage }: LanguageSelectProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs gap-1.5 border-border bg-subtle">
          <Code2 className="h-3.5 w-3.5 text-primary shrink-0" />
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent align="start" className="max-h-[300px]">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem key={lang.id} value={lang.id} className="text-xs">
              {lang.name}
              {detectedLanguage === lang.id && (
                <span className="ml-1.5 text-[10px] text-muted-foreground">(detected)</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
