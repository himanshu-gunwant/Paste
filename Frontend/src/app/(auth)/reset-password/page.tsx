import { Suspense } from "react";
import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — paste.himanshugunwant.com",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-muted">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
