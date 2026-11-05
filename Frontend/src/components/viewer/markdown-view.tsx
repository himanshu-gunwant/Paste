"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import mermaid from "mermaid";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export function MarkdownView({ content, className = "" }: MarkdownViewProps) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#0c0c0e",
        primaryColor: "#8b5cf6",
        primaryTextColor: "#f4f4f5",
        primaryBorderColor: "#3f3f46",
        lineColor: "#71717a",
      },
    });
  }, []);

  return (
    <div
      className={`prose prose-invert prose-zinc max-w-none p-6 text-sm leading-relaxed overflow-x-auto ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "";
            const textContent = String(children).replace(/\n$/, "");

            if (lang === "mermaid") {
              return <MermaidBlock code={textContent} />;
            }

            // Inline code
            if (!match) {
              return (
                <code
                  className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-purple-300"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code block with copy button
            return (
              <div className="relative group my-4 rounded-lg border border-border bg-canvas overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="font-mono text-[11px] uppercase tracking-wider">{lang}</span>
                  <CodeCopyButton text={textContent} />
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-canvas">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-border">
                <table className="w-full text-xs text-left border-collapse">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="border-b border-border bg-muted/50 p-2.5 font-semibold text-foreground">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-border/40 p-2.5 text-zinc-300">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-primary/60 bg-primary/5 pl-4 py-1 italic my-3 text-zinc-300">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function MermaidBlock({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    mermaid
      .render(id, code)
      .then((result) => {
        if (isMounted) {
          setSvg(result.svg);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to render Mermaid diagram");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 my-4">
        <p className="font-semibold pb-1">Mermaid Render Error</p>
        <pre className="font-mono text-[11px] whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center p-4 my-4 rounded-lg border border-border bg-canvas overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function CodeCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 px-2 text-[10px] gap-1 hover:bg-muted"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
