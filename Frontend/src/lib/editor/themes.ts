import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Custom dark theme matching our near-black zinc / violet design tokens
export const pasteDarkTheme = EditorView.theme(
  {
    "&": {
      color: "#f4f4f5",
      backgroundColor: "#09090b",
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#8b5cf6",
      fontFamily: "var(--font-geist-mono), 'JetBrains Mono', Menlo, Monaco, monospace",
      fontSize: "13px",
      lineHeight: "1.6",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#8b5cf6",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(139, 92, 246, 0.25) !important",
    },
    ".cm-gutters": {
      backgroundColor: "#09090b",
      color: "#52525b",
      borderRight: "1px solid #18181b",
      paddingRight: "8px",
      userSelect: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 12px 0 16px",
      minWidth: "30px",
      textAlign: "right",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 255, 255, 0.025)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      color: "#a1a1aa",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#18181b",
      border: "1px solid #27272a",
      color: "#a1a1aa",
      borderRadius: "3px",
      padding: "0 4px",
    },
  },
  { dark: true }
);

export const pasteSyntaxHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.keyword, color: "#c084fc", fontWeight: "500" }, // purple
    { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#e4e4e7" },
    { tag: [t.function(t.variableName), t.labelName], color: "#60a5fa" }, // blue
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#f87171" }, // red
    { tag: [t.definition(t.name), t.separator], color: "#d4d4d8" },
    {
      tag: [
        t.typeName,
        t.className,
        t.number,
        t.changed,
        t.annotation,
        t.modifier,
        t.self,
        t.namespace,
      ],
      color: "#fb923c", // orange
    },
    { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link], color: "#38bdf8" }, // cyan
    { tag: [t.meta, t.comment], color: "#71717a", fontStyle: "italic" }, // zinc-500
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.link, color: "#a78bfa", textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: "#f4f4f5" },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#f43f5e" }, // rose
    { tag: [t.processingInstruction, t.string, t.inserted], color: "#4ade80" }, // emerald-400
    { tag: t.invalid, color: "#ef4444" },
  ])
);
