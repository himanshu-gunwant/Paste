"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FilePlus,
  Compass,
  Folder,
  Bookmark,
  LayoutDashboard,
  BarChart3,
  FileCode,
  User,
  Laptop,
  Key,
  Shield,
  Search,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-[#141414] border-white/10 shadow-2xl max-w-xl overflow-hidden [&>button]:hidden sm:rounded-xl">
        <Command className="rounded-lg border-0 bg-transparent text-foreground">
          <div className="flex items-center px-4 border-b border-white/10">
            <Search className="h-4 w-4 text-muted mr-2 shrink-0" />
            <Command.Input
              placeholder="Type a command or search..."
              className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted text-foreground font-sans"
            />
          </div>

          <Command.List className="max-h-[340px] overflow-y-auto p-2 text-xs">
            <Command.Empty className="py-6 text-center text-xs text-muted">
              No results found.
            </Command.Empty>

            {/* Quick Actions / Navigation */}
            <Command.Group heading="Navigation" className="text-muted text-[10px] font-mono uppercase tracking-wider px-2 py-1.5">
              <Command.Item
                onSelect={() => runCommand(() => router.push("/new"))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
              >
                <FilePlus className="h-4 w-4 text-foreground/80" />
                <span>Create New Paste</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/explore"))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
              >
                <Compass className="h-4 w-4 text-foreground/80" />
                <span>Explore Pastes</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/languages"))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
              >
                <FileCode className="h-4 w-4 text-foreground/80" />
                <span>Languages Directory</span>
              </Command.Item>
            </Command.Group>

            {/* User Hub */}
            {isAuthenticated && (
              <Command.Group heading="User Hub" className="text-muted text-[10px] font-mono uppercase tracking-wider px-2 py-1.5 mt-2">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-foreground/80" />
                  <span>Dashboard</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => runCommand(() => router.push("/collections"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <Folder className="h-4 w-4 text-foreground/80" />
                  <span>My Collections</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => runCommand(() => router.push("/bookmarks"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <Bookmark className="h-4 w-4 text-foreground/80" />
                  <span>Bookmarks</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => runCommand(() => router.push("/analytics"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <BarChart3 className="h-4 w-4 text-foreground/80" />
                  <span>Analytics</span>
                </Command.Item>
              </Command.Group>
            )}

            {/* Settings */}
            {isAuthenticated && (
              <Command.Group heading="Settings" className="text-muted text-[10px] font-mono uppercase tracking-wider px-2 py-1.5 mt-2">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/settings"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <User className="h-4 w-4 text-foreground/80" />
                  <span>Account Profile</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => runCommand(() => router.push("/settings/sessions"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <Laptop className="h-4 w-4 text-foreground/80" />
                  <span>Active Sessions</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => runCommand(() => router.push("/settings/api-keys"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <Key className="h-4 w-4 text-foreground/80" />
                  <span>API Keys & Tokens</span>
                </Command.Item>
              </Command.Group>
            )}

            {/* Admin Workspace */}
            {isAdmin && (
              <Command.Group heading="Admin" className="text-muted text-[10px] font-mono uppercase tracking-wider px-2 py-1.5 mt-2">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/admin"))}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/5 cursor-pointer text-muted hover:text-foreground transition-colors"
                >
                  <Shield className="h-4 w-4 text-foreground/80" />
                  <span>Admin Workspace</span>
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-t border-white/10 text-[11px] text-muted">
            <span>Navigate with arrows, Enter to select</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-muted">
              ESC to close
            </kbd>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
