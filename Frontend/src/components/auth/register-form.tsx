"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OAuthButtons } from "./oauth-buttons";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_-]+$/i, "Username may only contain letters, numbers, hyphens, and underscores"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(128, "Password must be at most 128 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerAuth, isRegistering } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      setErrorMessage(null);
      await registerAuth(values);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to create account";
      setErrorMessage(msg);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Create an account</CardTitle>
        <CardDescription className="text-xs">
          Join paste.bin to manage pastes, revisions, bookmarks, and developer API keys.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isRegistering}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              autoComplete="username"
              disabled={isRegistering}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-[11px] text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password (min 10 characters)</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
              disabled={isRegistering}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[11px] text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-xs" disabled={isRegistering}>
            {isRegistering && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        <OAuthButtons />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="ml-1 text-primary hover:underline font-medium">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
