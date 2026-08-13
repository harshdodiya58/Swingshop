import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[70vh] items-center bg-ivory py-20">
      <Container className="mx-auto w-full max-w-md">
        <div className="surface-cream flex flex-col gap-6 rounded-radius-card p-8 shadow-card">
          <div className="text-center">
            <span className="eyebrow text-wood">Join the workshop family</span>
            <h1 className="font-display text-3xl text-ink">Create your account</h1>
            <p className="mt-2 text-sm text-muted">
              Track orders, save your wishlist and check out faster.
            </p>
          </div>
          <RegisterForm />
        </div>
      </Container>
    </div>
  );
}
