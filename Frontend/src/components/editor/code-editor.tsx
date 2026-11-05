"use client";

import { useEffect, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  placeholder as cmPlaceholder,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldGutter } from "@codemirror/language";
import { pasteDarkTheme, pasteSyntaxHighlighting } from "@/lib/editor/themes";
import { getLanguageExtension } from "@/lib/editor/languages";

interface CodeEditorProps {
  value: string;
  onChange?: (val: string) => void;
  language?: string;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  placeholder = "Paste your code or text here...",
  readOnly = false,
  autoFocus = true,
  onSubmit,
  className = "",
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const readOnlyCompartment = useRef(new Compartment());

  // Initialize CodeMirror instance
  useEffect(() => {
    if (!containerRef.current) return;

    const submitKeymap = onSubmit
      ? [
          {
            key: "Mod-Enter",
            run: () => {
              onSubmit();
              return true;
            },
          },
        ]
      : [];

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        bracketMatching(),
        foldGutter(),
        EditorView.lineWrapping,
        cmPlaceholder(placeholder),
        languageCompartment.current.of(getLanguageExtension(language)),
        readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
        keymap.of([
          ...submitKeymap,
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        pasteDarkTheme,
        pasteSyntaxHighlighting,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    viewRef.current = view;

    if (autoFocus && !readOnly) {
      view.focus();
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update language dynamically without recreating view
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: languageCompartment.current.reconfigure(getLanguageExtension(language)),
    });
  }, [language]);

  // Update readOnly dynamically
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: readOnlyCompartment.current.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  // Sync external value changes if not matching internal state
  useEffect(() => {
    if (!viewRef.current) return;
    const currentDoc = viewRef.current.state.doc.toString();
    if (value !== currentDoc) {
      viewRef.current.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[350px] overflow-hidden bg-background ${className}`}
    />
  );
}
