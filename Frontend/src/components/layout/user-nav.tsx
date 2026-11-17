"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  FolderGit2,
  Bookmark,
  BarChart3,
  Key,
  Shield,
  LogOut,
  Settings,
  Code2,
} from "lucide-react";
import LinkNext from "next/link";

export function UserNav() {
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-14 rounded-md bg-white/5 animate-pulse" />
        <div className="h-8 w-16 rounded-md bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <LinkNext href="/login">
          <Button variant="ghost" size="sm" className="text-xs text-zinc-300 hover:text-white hover:bg-white/5">
            Sign In
          </Button>
        </LinkNext>
        <LinkNext href="/register">
          <Button size="sm" className="text-xs bg-foreground text-background font-medium hover:bg-white">
            Sign Up
          </Button>
        </LinkNext>
      </div>
    );
  }

  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.username.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 ring-1 ring-white/10">
          <Avatar className="h-8 w-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.username} />}
            <AvatarFallback className="bg-white/5 text-foreground text-xs font-mono">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#141414] border-white/10" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-medium leading-none text-foreground">{user.displayName || user.username}</p>
            <p className="text-[11px] leading-none text-muted">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuGroup>
          <LinkNext href="/dashboard">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <Code2 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </LinkNext>
          <LinkNext href="/my-pastes">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>My Pastes</span>
            </DropdownMenuItem>
          </LinkNext>
          <LinkNext href="/collections">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <FolderGit2 className="mr-2 h-4 w-4" />
              <span>Collections</span>
            </DropdownMenuItem>
          </LinkNext>
          <LinkNext href="/bookmarks">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Bookmarks</span>
            </DropdownMenuItem>
          </LinkNext>
          <LinkNext href="/analytics">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </DropdownMenuItem>
          </LinkNext>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuGroup>
          <LinkNext href="/settings">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </LinkNext>
          <LinkNext href="/settings/api-keys">
            <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
              <Key className="mr-2 h-4 w-4" />
              <span>API Keys</span>
            </DropdownMenuItem>
          </LinkNext>
          {isAdmin && (
            <LinkNext href="/admin">
              <DropdownMenuItem className="cursor-pointer text-muted hover:text-foreground">
                <Shield className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </DropdownMenuItem>
            </LinkNext>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
