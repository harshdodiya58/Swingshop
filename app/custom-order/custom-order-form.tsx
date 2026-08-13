"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitCustomOrderFormAction } from "@/lib/actions";
import type { FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

const idle: FormState = { ok: false, error: undefined };

const swingTypes = [
  "2 Seater Swing",
  "3 Seater Swing",
  "4 Seater Swing",
  "Baby Jhoola",
  "Canopy Swing",
  "Garden Cradle",
  "Hanging Chair",
  "Other",
];

export function CustomOrderForm() {
  const [state, formAction, pending] = useActionState(submitCustomOrderFormAction, idle);
  const [swingType, setSwingType] = useState(swingTypes[1]);

  if (state.ok) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-radius-card border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
        <span className="text-4xl" aria-hidden>🙏</span>
        <h2 className="font-display text-2xl text-ink">Your idea is in the workshop</h2>
        <p className="text-sm text-muted">
          Our artisans have received your brief and will reach out with a
          sketch and quote within 2–3 working days.
        </p>
      </div>
    );
  }

  const field = (name: string) =>
    state.fieldErrors?.[name]?.join(", ");

  return (
    <form action={formAction} className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
      <p className="eyebrow text-wood md:col-span-2">Your details</p>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Full name *</span>
        <input
          name="name"
          required
          placeholder="e.g. Priya Sharma"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
        {field("name") && <span className="text-xs text-red-600">{field("name")}</span>}
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Mobile number *</span>
        <input
          name="phone"
          required
          inputMode="tel"
          placeholder="10-digit mobile"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
        {field("phone") && <span className="text-xs text-red-600">{field("phone")}</span>}
      </label>

      <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
        <span className="font-medium text-ink">Email *</span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
        {field("email") && <span className="text-xs text-red-600">{field("email")}</span>}
      </label>

      <p className="eyebrow text-wood md:col-span-2">What are we building?</p>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Swing type *</span>
        <div className="flex flex-wrap gap-2">
          {swingTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSwingType(t)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                swingType === t
                  ? "border-wood bg-wood text-white"
                  : "border-line bg-cream text-ink hover:border-wood",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <input type="hidden" name="swingType" value={swingType} />
        {field("swingType") && <span className="text-xs text-red-600">{field("swingType")}</span>}
      </label>

      <div className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Size</span>
        <input
          name="size"
          placeholder="e.g. 5 seater, 190 cm"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Material</span>
        <select
          name="material"
          defaultValue=""
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink focus:border-wood focus:outline-none"
        >
          <option value="">Choose…</option>
          <option>Sheesham Wood</option>
          <option>Burma Teak</option>
          <option>Mango Wood</option>
          <option>Wrought Iron</option>
          <option>Oak</option>
          <option>Teak + Rattan</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Finish</span>
        <input
          name="finish"
          placeholder="e.g. PU polish, matte"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Colour preference</span>
        <input
          name="color"
          placeholder="e.g. walnut, ivory"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Budget (₹)</span>
        <input
          name="budget"
          type="number"
          placeholder="e.g. 40000"
          className="h-11 rounded-lg border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
        <span className="font-medium text-ink">Describe your dream swing *</span>
        <textarea
          name="description"
          required
          rows={5}
          placeholder="Dimensions, style, carving preferences, where it will live, who will use it…"
          className="rounded-lg border border-line bg-cream px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-wood focus:outline-none"
        />
        {field("description") && <span className="text-xs text-red-600">{field("description")}</span>}
      </label>

      <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
        <span className="font-medium text-ink">
          Reference images <span className="font-normal text-muted">(optional — coming next stage)</span>
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          disabled
          className="h-11 rounded-lg border border-dashed border-line bg-cream px-4 text-sm text-muted"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 md:col-span-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-[52px] rounded-full bg-wood px-8 text-base font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60 md:col-span-2"
      >
        {pending ? "Sending your brief…" : "Submit Custom Order"}
      </button>

      <p className="text-center text-xs text-muted md:col-span-2">
        No advance payment needed at this stage. We reply with a sketch and quote.
      </p>
    </form>
  );
}