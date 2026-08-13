import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { formatINR } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { CartItemRow } from "./cart-item-row";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false },
};

async function getCart() {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  return db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });
}

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 20000 ? 0 : 499;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">Your Bag</span>
          <h1 className="font-display text-display-sm text-ink">Shopping Cart</h1>
        </Container>
      </header>

      <Container className="py-12">
        {items.length === 0 ? (
          <div className="surface-cream mx-auto flex max-w-md flex-col items-center gap-4 rounded-radius-card border border-dashed border-line px-6 py-16 text-center">
            <h2 className="font-display text-2xl text-ink">
              Your space is waiting for something beautiful
            </h2>
            <p className="text-muted">
              Your cart is empty. Explore handcrafted swings built to order.
            </p>
            <ButtonLink href="/shop" size="lg">
              Explore Collection
            </ButtonLink>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </ul>

            <aside className="surface-cream h-fit rounded-radius-card p-6 shadow-soft">
              <h2 className="font-display text-xl text-ink">Order Summary</h2>
              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-muted">
                  <dt>Subtotal</dt>
                  <dd className="text-ink">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted">
                  <dt>Delivery</dt>
                  <dd className="text-ink">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
                  <dt>Total</dt>
                  <dd>{formatINR(total)}</dd>
                </div>
              </dl>
              {deliveryFee > 0 && (
                <p className="mt-2 text-xs text-muted">
                  Add {formatINR(20000 - subtotal)} more for free delivery.
                </p>
              )}
              <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
                Proceed to Checkout
              </ButtonLink>
              <Link
                href="/shop"
                className="mt-4 block text-center text-sm font-medium text-wood-deep hover:underline"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </div>
  );
}