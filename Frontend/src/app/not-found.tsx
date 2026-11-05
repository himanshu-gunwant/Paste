import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Home, Compass, FilePlus } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[65vh] p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="inline-flex p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-violet-400">
          <Terminal className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 font-mono">
            404 — Not Found
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The paste, collection, or route you requested could not be located. It may have expired, burned upon reading, or been removed.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300">
            <Link href="/" className="gap-1.5">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300">
            <Link href="/explore" className="gap-1.5">
              <Compass className="h-4 w-4" />
              Explore
            </Link>
          </Button>

          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/new" className="gap-1.5">
              <FilePlus className="h-4 w-4" />
              Create Paste
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
