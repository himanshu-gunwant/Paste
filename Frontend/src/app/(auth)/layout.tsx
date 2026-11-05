import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground hover:opacity-90"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
            <Terminal className="h-4 w-4" />
          </div>
          <span>paste<span className="text-primary font-bold">.bin</span></span>
        </Link>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
