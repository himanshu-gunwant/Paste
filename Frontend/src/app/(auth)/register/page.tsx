import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account — paste.bin",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
