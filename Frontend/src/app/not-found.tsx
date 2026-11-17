import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="pt-20 sm:pt-28 space-y-6 max-w-lg mx-auto text-center animate-enter delay-1">
      <div className="space-y-3">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">
          404 — Not Found
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Lost in the quiet
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          The paste, collection, or route you requested could not be located. It may have expired, burned upon reading, or been removed.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button asChild size="sm">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/explore">Explore Pastes</Link>
        </Button>
      </div>
    </div>
  );
}
