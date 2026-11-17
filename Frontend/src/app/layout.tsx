import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CommandPalette } from "@/components/layout/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "paste — developer code sharing",
    template: "%s — paste · himanshugunwant.com",
  },
  description:
    "High-performance, minimal code sharing platform with syntax highlighting, revision diffing, Argon2id encryption, and collections by Himanshu Gunwant.",
  authors: [{ name: "Himanshu Gunwant", url: "https://himanshugunwant.com" }],
  creator: "Himanshu Gunwant",
  openGraph: {
    title: "paste — developer code sharing",
    description: "Fast, minimal code sharing for developers by Himanshu Gunwant.",
    siteName: "paste.himanshugunwant.com",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-white/20 selection:text-white">
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
