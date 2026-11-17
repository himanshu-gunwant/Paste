import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — paste.himanshugunwant.com",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
