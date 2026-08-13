import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

/**
 * Create a Razorpay order intent for a checkout.
 * Body: { orderId } — the internal order id (created via POST /api/orders).
 */
export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const orderId = body?.orderId;
  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });
  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.payment?.razorpayOrderId) {
    return NextResponse.json({ data: { orderId: order.payment.razorpayOrderId, amount: order.total } });
  }

  let razorpay;
  try {
    razorpay = getRazorpay();
  } catch {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  try {
    const rzpOrder = await razorpay.orders.create({
      amount: order.total * 100,
      currency: "INR",
      receipt: order.orderNumber,
      notes: { internalOrderId: order.id },
    });
    await db.payment.create({
      data: {
        orderId: order.id,
        razorpayOrderId: rzpOrder.id,
        amount: order.total,
        status: "PENDING",
      },
    });
    return NextResponse.json({
      data: { orderId: rzpOrder.id, amount: order.total },
    });
  } catch (e) {
    console.error("razorpay create order", e);
    return NextResponse.json({ error: "Could not start payment" }, { status: 500 });
  }
}