import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const [products, orders, customers, customOrders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.customOrder.count(),
  ]);
  const revenueAgg = await db.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } },
  });
  const pendingPayments = await db.payment.count({ where: { status: "PENDING" } });
  const lowStock = await db.product.count({ where: { stock: { lte: 3 } } });
  return NextResponse.json({
    data: {
      products,
      orders,
      customers,
      customOrders,
      revenue: revenueAgg._sum.total ?? 0,
      pendingPayments,
      lowStock,
    },
  });
}