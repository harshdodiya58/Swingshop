"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeCartItem, updateCartQuantity } from "@/lib/actions";
import { formatINR } from "@/lib/utils";

type Item = {
  id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  finish: string | null;
  product: {
    slug: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
};

export function CartItemRow({ item }: { item: Item }) {
  const [pending, setPending] = useState<"remove" | "inc" | "dec" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const max = item.product.stock;

  async function act(kind: "remove" | "inc" | "dec") {
    setPending(kind);
    const quantity =
      kind === "remove" ? 0 : kind === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    const res = quantity === 0 ? await removeCartItem(item.id) : await updateCartQuantity(item.id, quantity);

    setPending(null);
    if (res.ok) {
      router.refresh();
    } else {
      setErrorMsg(res.error ?? "Could not update the cart");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  }

  return (
    <li className="surface-cream flex gap-4 rounded-radius-card p-4 shadow-soft">
      <Link href={`/product/${item.product.slug}`} className="shrink-0">
        <div className="relative h-28 w-24 overflow-hidden rounded-lg bg-ivory">
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="font-display text-lg leading-snug text-ink hover:text-wood-deep"
            >
              {item.product.name}
            </Link>
            {item.size && <p className="text-xs text-muted">Size: {item.size}</p>}
            {item.finish && <p className="text-xs text-muted">Finish: {item.finish}</p>}
          </div>
          <button
            type="button"
            onClick={() => act("remove")}
            disabled={pending !== null}
            aria-label={`Remove ${item.product.name}`}
            className="rounded-full p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={() => act("dec")}
              disabled={pending !== null || item.quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-9 w-10 items-center justify-center text-ink disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-ink">{item.quantity}</span>
            <button
              type="button"
              onClick={() => act("inc")}
              disabled={pending !== null || item.quantity >= max}
              aria-label="Increase quantity"
              className="flex h-9 w-10 items-center justify-center text-ink disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="font-semibold text-wood-deep">
            {formatINR(item.product.price * item.quantity)}
          </p>
        </div>
        {errorMsg && (
          <p role="alert" className="text-xs text-red-600">
            {errorMsg}
          </p>
        )}
      </div>
    </li>
  );
}