import Razorpay from "razorpay";
import { createHmac } from "crypto";

export function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not configured");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * Server-side signature verification. Only create a confirmed order after
 * this passes (PRD §8). Uses razorpay.validatePaymentVerification.
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export function verifyOrderSignature(
  orderId: string,
  orderStatus: string,
  signature: string,
): boolean {
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${orderId}|${orderStatus}`)
    .digest("hex");
  return expected === signature;
}

export const razorpayMethods = ["UPI", "Card", "Netbanking", "COD"] as const;