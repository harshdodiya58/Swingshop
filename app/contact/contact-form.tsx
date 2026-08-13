"use client";

import { useActionState } from "react";
import { submitContactFormAction } from "@/lib/actions";
import type { FormState } from "@/lib/actions";

const idle: FormState = { ok: false, error: undefined };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactFormAction, idle);

  const fieldError = (name: string) =>
    state.fieldErrors?.[name]?.join(", ");

  if (state.ok && !state.error) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-radius-card border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
        <span className="text-3xl" aria-hidden>✓</span>
        <h3 className="font-display text-xl text-ink">Message sent</h3>
        <p className="text-sm text-muted">
          Thanks for reaching out — we&apos;ll get back to you within a working day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Name *</span>
          <input
            name="name"
            required
            className="h-11 rounded-lg border border-line bg-cream px-4 text-sm focus:border-wood focus:outline-none"
          />
          {fieldError("name") && <span className="text-xs text-red-600">{fieldError("name")}</span>}
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Email *</span>
          <input
            name="email"
            type="email"
            required
            className="h-11 rounded-lg border border-line bg-cream px-4 text-sm focus:border-wood focus:outline-none"
          />
          {fieldError("email") && <span className="text-xs text-red-600">{fieldError("email")}</span>}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Phone (optional)</span>
          <input
            name="phone"
            inputMode="tel"
            className="h-11 rounded-lg border border-line bg-cream px-4 text-sm focus:border-wood focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Interested product</span>
          <input
            name="product"
            placeholder="e.g. Royal Teak Swing"
            className="h-11 rounded-lg border border-line bg-cream px-4 text-sm focus:border-wood focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-lg border border-line bg-cream px-4 py-3 text-sm focus:border-wood focus:outline-none"
        />
        {fieldError("message") && <span className="text-xs text-red-600">{fieldError("message")}</span>}
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-[52px] rounded-full bg-wood px-8 text-base font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}