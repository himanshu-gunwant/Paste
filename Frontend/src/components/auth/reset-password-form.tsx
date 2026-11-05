"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { confirmPasswordReset } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const resetSchema = z
  .object({
    token: z.string().min(10, "Valid reset token required").max(200),
    newPassword: z.string().min(10, "Password must be at least 10 characters").max(128),
    confirmPassword: z.string().min(10, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: tokenParam,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetValues) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await confirmPasswordReset(values.token, values.newPassword);
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMessage((err as { message?: string })?.message || "Invalid or expired reset token");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Set new password</CardTitle>
        <CardDescription className="text-xs">
          Choose a new password for your account. All active sessions will be revoked.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Password successfully reset! You can now sign in with your new password.</span>
            </div>
            <Link href="/login" className="block w-full">
              <Button className="w-full text-xs">Proceed to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {!tokenParam && (
              <div className="space-y-1.5">
                <Label htmlFor="token">Reset Token</Label>
                <Input
                  id="token"
                  placeholder="Paste token from email"
                  disabled={isSubmitting}
                  {...register("token")}
                />
                {errors.token && (
                  <p className="text-[11px] text-red-400">{errors.token.message}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password (min 10 characters)</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••••••"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-[11px] text-red-400">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full text-xs" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              Save New Password
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline font-medium">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
