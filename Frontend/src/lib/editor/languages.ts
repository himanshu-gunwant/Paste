import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";

export interface LanguageOption {
  id: string;
  name: string;
  extension: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: "plaintext", name: "Plain Text", extension: "txt" },
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "typescript", name: "TypeScript", extension: "ts" },
  { id: "python", name: "Python", extension: "py" },
  { id: "rust", name: "Rust", extension: "rs" },
  { id: "go", name: "Go", extension: "go" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "c", name: "C", extension: "c" },
  { id: "html", name: "HTML", extension: "html" },
  { id: "css", name: "CSS", extension: "css" },
  { id: "json", name: "JSON", extension: "json" },
  { id: "markdown", name: "Markdown", extension: "md" },
  { id: "sql", name: "SQL", extension: "sql" },
  { id: "yaml", name: "YAML", extension: "yaml" },
  { id: "xml", name: "XML", extension: "xml" },
  { id: "java", name: "Java", extension: "java" },
  { id: "php", name: "PHP", extension: "php" },
  { id: "bash", name: "Bash", extension: "sh" },
];

export function getLanguageExtension(id: string): Extension {
  switch (id.toLowerCase()) {
    case "javascript":
    case "js":
      return javascript();
    case "typescript":
    case "ts":
      return javascript({ typescript: true });
    case "python":
    case "py":
      return python();
    case "rust":
    case "rs":
      return rust();
    case "go":
      return go();
    case "cpp":
    case "c":
      return cpp();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "markdown":
    case "md":
      return markdown();
    case "xml":
      return xml();
    case "sql":
      return sql();
    case "yaml":
    case "yml":
      return yaml();
    case "java":
      return java();
    case "php":
      return php();
    default:
      return [];
  }
}

const SHEBANG_MAP: [RegExp, string][] = [
  [/^\s*#!\s*\/?(?:usr\/)?(?:bin\/)?(?:env\s+)?(?:ba|z|k|da)?sh\b/, "bash"],
  [/^\s*#!.*python3?\b/, "python"],
  [/^\s*#!.*node\b/, "javascript"],
  [/^\s*#!.*ruby\b/, "ruby"],
  [/^\s*#!.*php\b/, "php"],
  [/^\s*#!.*perl\b/, "perl"],
];

const MARKERS: [RegExp, string, number][] = [
  [/^\s*<\?php/, "php", 5],
  [/<!doctype html|<html[\s>]/i, "html", 5],
  [/^\s*<\?xml/, "xml", 3],
  [/^\s*package main\b/m, "go", 5],
  [/\bfunc\s+\w+\s*\(/m, "go", 2],
  [/\bfn\s+\w+\s*\(|\blet\s+mut\b/m, "rust", 3],
  [/\bpublic\s+(static\s+)?(void|class)\b/m, "java", 4],
  [/\bSystem\.out\.print|\bimport\s+java\./m, "java", 3],
  [/\bdef\s+\w+\s*\(|\bself\b|\bimport\s+\w+\s*$|\bfrom\s+\w+\s+import\b/m, "python", 2],
  [/\bfunction\s+\w*\s*\(|\bconst\s+\w+\s*=|=>|console\.log/m, "javascript", 2],
  [/\binterface\s+\w+\s*\{|:\s*(string|number|boolean)\b/m, "typescript", 3],
  [/#include\s*[<"]|int\s+main\s*\(/m, "cpp", 4],
  [/\bSELECT\b.+\bFROM\b|\bINSERT\s+INTO\b/i, "sql", 4],
  [/^\s*[.#@][\w-]+\s*\{[^}]*:[^}]*;/m, "css", 4],
];

export function detectLanguage(content: string): string | null {
  if (!content || content.length < 5) return null;
  const head = content.slice(0, 4000);

  for (const [pattern, language] of SHEBANG_MAP) {
    if (pattern.test(head)) return language;
  }

  let best: { language: string; score: number } | null = null;
  for (const [pattern, language, weight] of MARKERS) {
    if (!pattern.test(head)) continue;
    if (!best || weight > best.score) best = { language, score: weight };
  }
  if (best && best.score >= 2) return best.language;

  const trimmed = head.trimStart();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(content);
      return "json";
    } catch {
      // not JSON
    }
  }
  return null;
}
