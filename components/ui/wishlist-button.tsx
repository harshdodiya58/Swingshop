"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productSlug,
  productName,
  initiallySaved = false,
}: {
  productSlug: string;
  productName: string;
  initiallySaved?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      const res = await toggleWishlist(productSlug);
      if (!res.ok) {
        if (res.error?.includes("sign in")) {
          router.push(`/login?callbackUrl=${encodeURIComponent(`/shop?wish=${productSlug}`)}`);
          return;
        }
        return;
      }
      setSaved(Boolean(res.data?.added));
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={onClick}
      aria-label={`${saved ? "Remove" : "Add"} ${productName} ${saved ? "from" : "to"} wishlist`}
      aria-pressed={saved}
      title={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 shadow-soft backdrop-blur transition-all",
        "opacity-100 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100",
        pending && "cursor-wait opacity-60",
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          saved ? "fill-wood-deep text-wood-deep" : "text-ink hover:text-wood-deep",
        )}
      />
    </button>
  );
}
