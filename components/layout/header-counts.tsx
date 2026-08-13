"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export function HeaderCounts() {
  const [counts, setCounts] = useState({ cart: 0, wishlist: 0 });
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    fetch("/api/me/counts", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (active) setCounts(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  const badge = "absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-wood px-1 text-[10px] font-semibold text-white";

  return (
    <>
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="relative hidden rounded-full p-2 text-ink transition-colors hover:bg-wood/10 hover:text-wood-deep sm:inline-flex"
      >
        <Heart className="h-5 w-5" />
        {counts.wishlist > 0 && (
          <span className={badge} aria-live="polite">
            {counts.wishlist}
          </span>
        )}
      </Link>
      <Link
        href="/cart"
        aria-label="Cart"
        className="relative rounded-full p-2 text-ink transition-colors hover:bg-wood/10 hover:text-wood-deep"
      >
        <ShoppingBag className="h-5 w-5" />
        {counts.cart > 0 && (
          <span className={badge} aria-live="polite">
            {counts.cart > 99 ? "99+" : counts.cart}
          </span>
        )}
      </Link>
    </>
  );
}
