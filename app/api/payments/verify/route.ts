import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { verifyPaymentSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

const RZP_TEST_MODE = (process.env.RAZORPAY_KEY_ID ?? "").startsWith("rzp_test");

/**
 * Verifies a Razorpay payment and confirms the internal order only after the
 * server-side signature check passes (PRD §8). Handles success/failure
 * distinctly; a verification key error is also sent here.
 */
export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { rzpOrderId, rzpPaymentId, rzpSignature } = body ?? {};
  if (!rzpOrderId || !rzpPaymentId || !rzpSignature) {
    // Cancelled / failed checkout
    const cancelled = await db.payment.updateMany({
      where: { razorpayOrderId: rzpOrderId, status: "PENDING" },
      data: { status: "FAILED" },
    });
    return NextResponse.json({ error: "Payment not completed", cancelled }, { status: 400 });
  }

  const payment = await db.payment.findUnique({ where: { razorpayOrderId: rzpOrderId } });
  if (!payment) return NextResponse.json({ error: "Unknown payment" }, { status: 404 });

  const order = await db.order.findUnique({ where: { id: payment.orderId! } });
  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const ok = verifyPaymentSignature(rzpOrderId, rzpPaymentId, rzpSignature);
  if (!ok) {
    await db.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  await db.$transaction([
    db.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: rzpSignature,
        status: "PAID",
        method: "RAZORPAY",
      },
    }),
    db.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } }),
  ]);

  return NextResponse.json({
    data: { orderId: order.id, orderNumber: order.orderNumber, confirmed: !RZP_TEST_MODE },
  });
}