"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerFormAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

const idle = { ok: false, error: undefined } as const;

export function RegisterForm() {
  const [state, , pending] = useActionState(registerFormAction, idle);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await registerFormAction(idle, data);
    if (!result.ok) return;
    await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });
    router.replace("/account");
  }

  const fieldClass =
    "h-11 rounded-lg border border-line bg-cream px-4 text-sm focus:border-wood focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Full name</span>
        <input name="name" type="text" required minLength={2} className={fieldClass} />
        {state.fieldErrors?.name?.map((m) => (
          <span key={m} className="text-xs text-red-600">{m}</span>
        ))}
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Email</span>
        <input name="email" type="email" required className={fieldClass} />
        {state.fieldErrors?.email?.map((m) => (
          <span key={m} className="text-xs text-red-600">{m}</span>
        ))}
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Password</span>
        <input name="password" type="password" required minLength={8} className={fieldClass} />
        <span className="text-xs text-muted">At least 8 characters</span>
        {state.fieldErrors?.password?.map((m) => (
          <span key={m} className="text-xs text-red-600">{m}</span>
        ))}
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "h-11 rounded-full bg-wood text-sm font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60",
        )}
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-wood-deep hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
