"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  couponCode: string | null;
  user: { name: string; email: string } | null;
  items: { id: string; name: string; quantity: number; price: number }[];
  payment: { status: string; method: string | null } | null;
};

const statuses = [
  "PENDING", "CONFIRMED", "PROCESSING", "CRAFTING", "QUALITY_CHECK",
  "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
] as const;

export function OrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/orders")
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error ?? "Failed to load orders");
        } else {
          setOrders(json.data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load orders");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } else {
      const json = await res.json();
      setError(json.error ?? "Failed to update");
    }
  }

  if (loading) return <p className="mt-6 text-sm text-muted">Loading orders…</p>;
  if (error) return <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {orders.length === 0 && (
        <p className="text-sm text-muted">No orders yet.</p>
      )}
      {orders.map((order) => (
        <div
          key={order.id}
          className="surface-cream rounded-radius-card border border-line p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-ink">{order.orderNumber}</p>
              <p className="text-xs text-muted">
                {order.user ? `${order.user.name} · ${order.user.email}` : "Guest"} ·{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
            <p className="font-display text-lg text-ink">{formatINR(order.total)}</p>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="h-9 rounded-lg border border-line bg-cream px-3 text-xs focus:border-wood focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <ul className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-xs text-muted">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.quantity} × {item.name}</span>
                <span>{formatINR(item.price)}</span>
              </li>
            ))}
          </ul>
          {order.payment && (
            <p className="mt-2 text-xs text-muted">
              Payment: {order.payment.status}{order.payment.method ? ` via ${order.payment.method}` : ""}
              {order.couponCode ? ` · coupon ${order.couponCode}` : ""}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}