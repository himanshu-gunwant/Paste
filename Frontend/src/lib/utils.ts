import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  rust: "Rust",
  go: "Go",
  cpp: "C++",
  c: "C",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  markdown: "Markdown",
  xml: "XML",
  sql: "SQL",
  yaml: "YAML",
  java: "Java",
  php: "PHP",
  bash: "Bash",
  ruby: "Ruby",
  perl: "Perl",
  plaintext: "Plain Text",
};

export const LANGUAGE_FILE_EXTENSIONS: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  rust: "rs",
  go: "go",
  cpp: "cpp",
  c: "c",
  html: "html",
  css: "css",
  json: "json",
  markdown: "md",
  xml: "xml",
  sql: "sql",
  yaml: "yaml",
  java: "java",
  php: "php",
  bash: "sh",
  ruby: "rb",
  perl: "pl",
  plaintext: "txt",
};
