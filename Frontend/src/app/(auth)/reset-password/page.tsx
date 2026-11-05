import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — paste.bin",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs text-muted-foreground">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
