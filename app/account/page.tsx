import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId, signOut } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  CRAFTING: "Being crafted",
  QUALITY_CHECK: "Quality check",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function AccountPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true, payment: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-10">
        <Container className="flex flex-col gap-2">
          <span className="eyebrow text-wood">Welcome back</span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-display-sm text-ink">
              {user.name ?? user.email}
            </h1>
          </div>
        </Container>
      </header>

      <Container className="py-12">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className={buttonClasses({ variant: "outline", size: "sm" })}>
              Sign out
            </button>
          </form>
          {user.role === "ADMIN" && (
            <Link href="/admin" className={buttonClasses({ size: "sm" })}>
              Admin Dashboard
            </Link>
          )}
        </div>

        <h2 className="font-display text-2xl text-ink">Your orders</h2>

        {user.orders.length === 0 ? (
          <div className="mt-6 rounded-radius-card border border-dashed border-line bg-cream px-6 py-14 text-center">
            <p className="text-muted">No orders yet — your first swing awaits.</p>
            <Link href="/shop" className={`mt-4 ${buttonClasses({ size: "lg" })}`}>
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-4">
            {user.orders.map((order) => (
              <li
                key={order.id}
                className="surface-cream rounded-radius-card p-6 shadow-soft"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-medium text-ink">{order.orderNumber}</span>
                    <span className="text-xs text-muted">
                      {order.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-sage/15 px-3 py-1 text-xs text-sage-deep">
                      {statusLabel[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>
                <ul className="mt-4 flex flex-col gap-1 border-t border-line pt-4 text-sm text-muted">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span className="line-clamp-1">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="shrink-0 text-ink">{formatINR(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}