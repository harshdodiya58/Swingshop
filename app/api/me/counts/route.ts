import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ cart: 0, wishlist: 0 });
  }
  const [cart, wishlist] = await Promise.all([
    db.cart.findUnique({
      where: { userId },
      select: { items: { select: { quantity: true } } },
    }),
    db.wishlist.findUnique({
      where: { userId },
      select: { _count: { select: { items: true } } },
    }),
  ]);
  const cartCount = (cart?.items ?? []).reduce((sum, i) => sum + i.quantity, 0);
  return NextResponse.json({ cart: cartCount, wishlist: wishlist?._count.items ?? 0 });
}
