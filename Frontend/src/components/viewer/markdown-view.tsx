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
        background: "#0f0f0f",
        primaryColor: "#f5f5f5",
        primaryTextColor: "#f5f5f5",
        primaryBorderColor: "rgba(255, 255, 255, 0.15)",
        lineColor: "#9ca3af",
      },
    });
  }, []);

  return (
    <div
      className={`prose prose-invert prose-neutral max-w-none text-sm leading-relaxed overflow-x-auto prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-strong:text-foreground prose-blockquote:border-l-white/20 prose-blockquote:text-foreground/90 prose-code:text-foreground prose-code:font-mono prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white/[0.02] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-a:text-foreground hover:prose-a:text-white prose-a:underline-offset-4 ${className}`}
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
                  className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-xs text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Code block with copy button
            return (
              <div className="relative group my-4 rounded-lg border border-white/10 bg-[#0f0f0f] overflow-hidden not-prose">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs text-muted">
                  <span className="font-mono text-[11px] uppercase tracking-wider">{lang}</span>
                  <CodeCopyButton text={textContent} />
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0f0f0f] text-foreground m-0">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                <table className="w-full text-xs text-left border-collapse">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="border-b border-white/10 bg-white/[0.03] p-2.5 font-semibold text-foreground">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-white/5 p-2.5 text-muted">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-white underline underline-offset-4 transition-colors"
              >
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-white/20 bg-white/[0.02] pl-4 py-1 italic my-3 text-foreground/90">
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
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 my-4 not-prose">
        <p className="font-semibold pb-1">Mermaid Render Error</p>
        <pre className="font-mono text-[11px] whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center p-4 my-4 rounded-lg border border-white/10 bg-white/[0.02] overflow-x-auto not-prose"
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
      className="h-6 px-2 text-[10px] gap-1 text-muted hover:text-foreground hover:bg-white/5"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
