import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { getWishlistItems } from "@/lib/queries";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";

export const metadata: Metadata = {
  title: "Your Wishlist",
  robots: { index: false },
};

export default async function WishlistPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const items = await getWishlistItems(userId);

  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-10">
        <Container className="flex flex-col items-center gap-2 text-center">
          <span className="eyebrow text-wood">Saved</span>
          <h1 className="font-display text-display-sm text-ink">Your wishlist</h1>
        </Container>
      </header>

      <Container className="py-12">
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-radius-card border border-dashed border-line bg-cream px-6 py-14 text-center">
            <h2 className="font-display text-2xl text-ink">Nothing saved yet</h2>
            <p className="text-sm text-muted">
              Tap the heart on any swing to save it here.
            </p>
            <Link href="/shop" className={buttonClasses({ size: "lg" })}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}