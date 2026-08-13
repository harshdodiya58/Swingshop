"use client";

import { useActionState, useEffect, useRef } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { cn } from "@/lib/utils";

const initialState = { ok: false as boolean, error: undefined as string | undefined };

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn("flex w-full max-w-md flex-col gap-3", className)}
    >
      <label htmlFor="newsletter-email" className="eyebrow text-gold">
        Join our list
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email address"
          className="h-11 w-full rounded-full border border-ivory/25 bg-transparent px-5 text-sm text-ivory placeholder:text-ivory/45 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 shrink-0 rounded-full bg-gold px-6 text-sm font-medium text-wood-deep transition-colors hover:bg-wood hover:text-white disabled:opacity-60"
        >
          {pending ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-xs text-gold">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-xs text-emerald-300">
          Subscribed — welcome to the family.
        </p>
      )}
    </form>
  );
}