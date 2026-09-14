import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/propostas/LoginForm";

export const metadata: Metadata = {
  title: "Entrar | Propostas Frotec",
  robots: { index: false, follow: false },
};

export default function LoginPropostasPage() {
  return (
    <Suspense fallback={<main className="proposta-login" />}>
      <LoginForm />
    </Suspense>
  );
}
