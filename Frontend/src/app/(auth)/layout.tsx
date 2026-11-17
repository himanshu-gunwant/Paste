import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 animate-enter">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-foreground hover:text-white transition-colors"
        >
          paste.himanshugunwant.com
        </Link>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
