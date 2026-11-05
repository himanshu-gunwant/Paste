import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Plus, Compass } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Terminal className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">paste.bin</h1>
        <p className="text-xs text-muted-foreground">
          Developer-first code sharing platform. Clean dark interface, syntax highlighting,
          snapshot revisions, Argon2id passwords, and collections.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Link href="/new">
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
              <Plus className="h-4 w-4" />
              <span>Create Paste</span>
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="sm" variant="outline" className="gap-2 text-xs border-border bg-subtle">
              <Compass className="h-4 w-4" />
              <span>Explore Public</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
