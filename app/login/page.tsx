import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false },
};

export default async function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center bg-ivory py-20">
      <Container className="mx-auto w-full max-w-md">
        <div className="surface-cream flex flex-col gap-6 rounded-radius-card p-8 shadow-card">
          <div className="text-center">
            <span className="eyebrow text-wood">Welcome back</span>
            <h1 className="font-display text-3xl text-ink">Sign in to your account</h1>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}