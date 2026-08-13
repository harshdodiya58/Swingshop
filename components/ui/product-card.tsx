import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { ProductCardData } from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import { WishlistButton } from "@/components/ui/wishlist-button";

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <article className="group relative surface-cream overflow-hidden rounded-radius-card shadow-soft transition-shadow duration-300 hover:shadow-hover">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isBestseller && (
            <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold tracking-wide text-wood-deep">
              Best Seller
            </span>
          )}
          {discount && (
            <span className="absolute right-3 top-3 rounded-full bg-ivory/90 px-2.5 py-1 text-[11px] font-semibold text-wood-deep backdrop-blur">
              {discount}% off
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
              <span className="rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-ink">
                Sold out
              </span>
            </div>
          )}
        </div>
      </Link>

      <WishlistButton productSlug={product.slug} productName={product.name} />

      <div className="flex flex-col gap-1.5 p-4">
        <p className="eyebrow text-[10px] text-muted">{product.category?.name}</p>
        <Link
          href={`/product/${product.slug}`}
          className="font-display text-lg leading-snug text-ink transition-colors hover:text-wood-deep"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-gold" : "opacity-30"}`}
              aria-hidden
            />
          ))}
          <span className="ml-1 text-xs text-muted">({product.reviewCount})</span>
        </div>
        <p className="text-muted">{product.material}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-wood-deep">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}