"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { addToCartFormAction } from "@/lib/actions";
import { buttonClasses } from "@/components/ui/button";

const idle = { ok: false } as const;

export function AddToCartButton({
  productSlug,
  stock,
  price,
}: {
  productSlug: string;
  stock: number;
  price: number;
}) {
  const [qty, setQty] = useState(1);
  const [state, formAction, pending] = useActionState(addToCartFormAction, idle);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) return;
    const show = setTimeout(() => setAdded(true), 0);
    const hide = setTimeout(() => setAdded(false), 2200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [state]);

  const soldOut = stock <= 0;
  const requiresLogin =
    !state.ok && state.error?.includes("sign in");

  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="productSlug" value={productSlug} />
        <input type="hidden" name="quantity" value={qty} />
        <div className="flex h-[52px] items-center rounded-full border border-line bg-cream">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-full w-12 items-center justify-center text-ink disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-ink" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={qty >= stock || soldOut}
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="flex h-full w-12 items-center justify-center text-ink disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={pending || soldOut}
          className={buttonClasses({ variant: soldOut ? "ghost" : "primary", size: "lg" })}
        >
          {pending ? (
            "Adding…"
          ) : added ? (
            "Added to bag ✓"
          ) : soldOut ? (
            "Sold out"
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" aria-hidden />
              Add to Cart · {price.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
            </>
          )}
        </button>
      </form>
      {requiresLogin ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-cream px-4 py-3">
          <p className="text-sm text-ink">
            <span className="font-medium">Sign in to add this to your bag.</span>
          </p>
          <button
            type="button"
            onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`)}
            className="text-sm font-semibold text-wood-deep underline-offset-2 hover:underline"
          >
            Sign in
          </button>
        </div>
      ) : (
        !state.ok && state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )
      )}
      {soldOut && (
        <p className="text-sm text-muted">
          This piece is currently being handcrafted. Contact us for availability.
        </p>
      )}
    </div>
  );
}