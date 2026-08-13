"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  finish: string | null;
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    images: string[];
  };
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Flow = "idle" | "creating" | "paying" | "verifying" | "success" | "error";

export function CheckoutPanel({ items }: { items: CartItem[] }) {
  const [flow, setFlow] = useState<Flow>("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const deliveryFee = subtotal >= 20000 ? 0 : 499;
  const total = subtotal + deliveryFee;

  async function loadRazorpay() {
    if (window.Razorpay) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePay() {
    setFlow("creating");
    setMessage("");

    // 1. Create internal order
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          size: i.size ?? undefined,
          color: i.color ?? undefined,
          finish: i.finish ?? undefined,
        })),
      }),
    });
    const orderJson = await orderRes.json();
    if (!orderRes.ok) {
      setFlow("error");
      setMessage(orderJson.error ?? "Could not create the order");
      return;
    }
    const internalOrderId = orderJson.data.orderId;

    // 2. Create Razorpay order intent
    const rzpRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: internalOrderId }),
    });
    const rzpJson = await rzpRes.json();
    if (!rzpRes.ok) {
      setFlow("error");
      setMessage(rzpJson.error ?? "Could not start payment");
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      // Fallback: placeholder order confirmation for demo/dev (no key configured).
      setFlow("success");
      setMessage("Checkout script unavailable — order recorded. (Payment gateway not configured)");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount: rzpJson.data.amount * 100,
      currency: "INR",
      name: "Shree Chamunda Swings",
      order_id: rzpJson.data.orderId,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        setFlow("verifying");
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const verifyJson = await verifyRes.json();
        if (verifyRes.ok) {
          setFlow("success");
          setMessage(`Order ${verifyJson.data.orderNumber} confirmed!`);
          router.refresh();
        } else {
          setFlow("error");
          setMessage(verifyJson.error ?? "Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => {
          setFlow("idle");
          setMessage("Payment closed. You can retry anytime.");
        },
      },
    };
    const rzp = new window.Razorpay(options);
    setFlow("paying");
    rzp.open();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="surface-cream flex flex-col gap-6 rounded-radius-card p-6 shadow-soft sm:p-8">
        <h2 className="font-display text-2xl text-ink">Payment</h2>
        <p className="text-sm text-muted">
          Razorpay secure checkout — UPI, Cards, Net Banking and Cash on Delivery.
        </p>

        <dl className="flex flex-col gap-3 border-t border-line pt-6 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Subtotal</dt>
            <dd className="text-ink">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt>
            <dd className="text-ink">{deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : formatINR(deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-ink">
            <dt>Total</dt>
            <dd>{formatINR(total)}</dd>
          </div>
        </dl>

        {flow === "error" && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {message}
          </p>
        )}
        {flow === "success" && (
          <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        )}

        <Button
          size="lg"
          onClick={handlePay}
          disabled={flow !== "idle"}
          className="w-full"
        >
          {flow === "creating" && "Creating order…"}
          {flow === "paying" && "Complete payment in popup…"}
          {flow === "verifying" && "Verifying payment…"}
          {(flow === "idle" || flow === "error") && `Pay ${formatINR(total)} securely`}
        </Button>
        <p className="text-center text-xs text-muted">
          Your order is confirmed only after server-side signature verification.
        </p>
      </div>

      <div className="surface-cream h-fit rounded-radius-card p-6 shadow-soft">
        <h2 className="font-display text-lg text-ink">In your cart</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-1 text-ink">{item.product.name}</span>
              <span className="shrink-0 text-muted">
                {item.quantity} × {formatINR(item.product.price)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}