import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Custom dark theme matching the minimal personal site design system (#0f0f0f, monochrome highlights)
export const pasteDarkTheme = EditorView.theme(
  {
    "&": {
      color: "#f5f5f5",
      backgroundColor: "#0f0f0f",
      height: "100%",
    },
    ".cm-content": {
      caretColor: "#f5f5f5",
      fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "13px",
      lineHeight: "1.65",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#f5f5f5",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(255, 255, 255, 0.18) !important",
    },
    ".cm-gutters": {
      backgroundColor: "#0f0f0f",
      color: "#888888",
      borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      paddingRight: "8px",
      userSelect: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 12px 0 16px",
      minWidth: "30px",
      textAlign: "right",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 255, 255, 0.025)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      color: "#ffffff",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-placeholder": {
      color: "#71717a",
      fontStyle: "normal",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "#171717",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: "#9ca3af",
      borderRadius: "3px",
      padding: "0 4px",
    },
  },
  { dark: true }
);

export const pasteSyntaxHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.keyword, color: "#f5f5f5", fontWeight: "600" },
    { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#e5e5e5" },
    { tag: [t.function(t.variableName), t.labelName], color: "#93c5fd" },
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#fca5a5" },
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
      color: "#fde047",
    },
    { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link], color: "#cbd5e1" },
    { tag: [t.meta, t.comment], color: "#71717a", fontStyle: "italic" },
    { tag: t.strong, fontWeight: "bold", color: "#ffffff" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.link, color: "#e5e5e5", textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: "#f5f5f5" },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#fda4af" },
    { tag: [t.processingInstruction, t.string, t.inserted], color: "#86efac" },
    { tag: t.invalid, color: "#ef4444" },
  ])
);
