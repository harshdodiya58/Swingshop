import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { CheckoutPanel } from "./checkout-panel";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

async function getCart() {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  return db.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
  });
}

export default async function CheckoutPage() {
  const userId = await getCurrentUserId();
  const cart = await getCart();
  const items = cart?.items ?? [];

  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-10">
        <Container className="flex flex-col items-center gap-2 text-center">
          <span className="eyebrow text-wood">Secure Checkout</span>
          <h1 className="font-display text-display-sm text-ink">Almost there</h1>
        </Container>
      </header>

      <Container className="py-12">
        {!userId ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-radius-card border border-dashed border-line bg-cream px-6 py-14 text-center">
            <h2 className="font-display text-2xl text-ink">Sign in to continue</h2>
            <p className="text-sm text-muted">
              Create an account or sign in to save cart items and complete your order.
            </p>
            <Link href="/login" className={buttonClasses({ size: "lg" })}>
              Sign in / Create account
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-radius-card border border-dashed border-line bg-cream px-6 py-14 text-center">
            <h2 className="font-display text-2xl text-ink">Your cart is empty</h2>
            <Link href="/shop" className={buttonClasses({ variant: "outline", size: "lg" })}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <CheckoutPanel items={items} />
        )}
      </Container>
    </div>
  );
}