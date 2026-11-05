import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — paste.bin",
};

export default function LoginPage() {
  return <LoginForm />;
}
