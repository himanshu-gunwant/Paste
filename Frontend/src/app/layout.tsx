import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CommandPalette } from "@/components/layout/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "paste.bin — Developer-First Pastebin Platform",
  description:
    "High-performance, minimal code sharing with syntax highlighting, snapshot revisions, Argon2id passwords, and collections.",
  openGraph: {
    title: "paste.bin — Developer-First Pastebin Platform",
    description: "Fast, minimal code sharing for developers.",
    siteName: "paste.bin",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col font-sans bg-background text-foreground antialiased`}
      >
        <Providers>
          <SiteHeader />
          <CommandPalette />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
