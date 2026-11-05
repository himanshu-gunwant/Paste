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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255),
  password: z.string().min(1, "Password is required").max(128),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setErrorMessage(null);
      await login(values);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Invalid email or password";
      setErrorMessage(msg);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Sign in</CardTitle>
        <CardDescription className="text-xs">
          Enter your email and password to access your pastes and collections.
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
              disabled={isLoggingIn}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoggingIn}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[11px] text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-xs" disabled={isLoggingIn}>
            {isLoggingIn && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <OAuthButtons />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="ml-1 text-primary hover:underline font-medium">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
