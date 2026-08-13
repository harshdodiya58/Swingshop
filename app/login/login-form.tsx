"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

type Mode = "password" | "otp";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("password");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDevCode, setOtpDevCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpResendWait, setOtpResendWait] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  async function finishRedirect() {
    const res = await fetch("/api/auth/session").then((r) => r.json());
    const role = res?.user?.role;
    if (role === "ADMIN") {
      router.replace("/admin");
    } else if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
      router.replace(callbackUrl);
    } else {
      router.replace("/account");
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    const password = new FormData(form).get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    await finishRedirect();
  }

  async function sendOtp() {
    setOtpLoading(true);
    setError("");
    setOtpDevCode("");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Could not send the code");
        if (json.resendInMs) setOtpResendWait(Math.ceil(json.resendInMs / 1000));
        return;
      }
      setOtpSent(true);
      if (json.devCode) setOtpDevCode(json.devCode);
    } catch {
      setError("Could not send the code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const form = e.currentTarget;
    const code = new FormData(form).get("code") as string;

    const res = await signIn("credentials", {
      email: otpEmail,
      code,
      mode: "otp",
      redirect: false,
    });
    setPending(false);

    if (res?.error) {
      setError("Incorrect or expired code. Please try again.");
      return;
    }
    await finishRedirect();
  }

  const fieldClass =
    "h-11 rounded-lg border border-line bg-cream px-4 text-sm focus:border-wood focus:outline-none";

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex rounded-full border border-line p-1">
        {(["password", "otp"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
              mode === m
                ? "bg-wood text-white"
                : "text-muted hover:text-ink",
            )}
          >
            {m === "password" ? "Password" : "OTP / Email"}
          </button>
        ))}
      </div>

      {mode === "password" ? (
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Email</span>
            <input name="email" type="email" required className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Password</span>
            <input name="password" type="password" required className={fieldClass} />
          </label>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-full bg-wood text-sm font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Email</span>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                className={cn(fieldClass, "flex-1")}
                placeholder="you@gmail.com"
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading || !otpEmail || otpResendWait > 0}
                className="h-11 shrink-0 rounded-full border border-wood px-4 text-sm font-medium text-wood-deep transition-colors hover:bg-wood/10 disabled:opacity-50"
              >
                {otpLoading
                  ? "Sending…"
                  : otpResendWait > 0
                    ? `Wait ${otpResendWait}s`
                    : otpSent
                      ? "Resend code"
                      : "Send code"}
              </button>
            </div>
          </label>

          {otpDevCode && (
            <p className="rounded-lg bg-gold/15 px-4 py-2 text-xs text-wood-deep">
              Development: your code is <strong>{otpDevCode}</strong> (also printed in the server
              console). Configure SMTP to send real emails.
            </p>
          )}

          {otpSent && (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink">One-time code</span>
              <input
                name="code"
                type="text"
                inputMode="numeric"
                required
                pattern="[0-9]{6}"
                maxLength={6}
                autoComplete="one-time-code"
                className={fieldClass}
                placeholder="6-digit code"
              />
            </label>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !otpSent}
            className="h-11 rounded-full bg-wood text-sm font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Verify & sign in"}
          </button>
        </form>
      )}

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" aria-hidden />
        or
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/post-login" })}
        className="flex h-11 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium text-ink transition-colors hover:border-wood"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.4-2.84h.26z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-sm text-muted">
        New to Shree Chamunda?{" "}
        <Link href="/register" className="font-medium text-wood-deep hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
