"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, KeyRound, AlertCircle, Loader2 } from "lucide-react";
import { PasteView } from "@/types/paste";
import { unlockPaste } from "@/lib/api/pastes";
import { toast } from "sonner";

interface PasswordGateProps {
  pasteId: string;
  shareToken?: string;
  onUnlocked: (paste: PasteView, passwordUsed: string) => void;
}

export function PasswordGate({ pasteId, shareToken, onUnlocked }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    try {
      setIsUnlocking(true);
      setError(null);
      const unlocked = await unlockPaste(pasteId, password, { shareToken });
      toast.success("Paste unlocked");
      onUnlocked(unlocked, password);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Incorrect password";
      setError(msg);
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <Card className="w-full max-w-sm border-border bg-card">
        <CardHeader className="pb-3 text-center">
          <div className="flex justify-center pb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Lock className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-base font-semibold">Password Protected</CardTitle>
          <CardDescription className="text-xs">
            This paste is encrypted with Argon2id. Enter the password below to decrypt and view the content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400 mb-3 text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="gate-password">Password</Label>
              <div className="relative">
                <Input
                  id="gate-password"
                  type="password"
                  placeholder="Enter paste password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isUnlocking}
                  autoFocus
                  className="pr-9"
                />
                <KeyRound className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Button type="submit" className="w-full text-xs" disabled={isUnlocking}>
              {isUnlocking && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Unlock Paste
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
