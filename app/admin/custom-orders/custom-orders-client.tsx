"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";

type CustomOrder = {
  id: string;
  name: string;
  phone: string;
  email: string;
  swingType: string;
  size: string | null;
  material: string | null;
  finish: string | null;
  color: string | null;
  budget: number | null;
  description: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
};

const statuses = [
  "NEW", "IN_REVIEW", "QUOTED", "ACCEPTED", "IN_PRODUCTION", "COMPLETED", "DECLINED",
] as const;

export function CustomOrdersClient() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/custom-orders")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load");
        setOrders(json.data);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function patch(id: string, data: { status?: string; adminNotes?: string }) {
    const res = await fetch("/api/admin/custom-orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (res.ok) {
      const json = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? json.data : o)));
      setError("");
    } else {
      const json = await res.json();
      setError(json.error ?? "Failed to update");
    }
  }

  if (loading) return <p className="mt-6 text-sm text-muted">Loading custom orders…</p>;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {orders.length === 0 && <p className="text-sm text-muted">No custom orders yet.</p>}
      {orders.map((o) => (
        <div key={o.id} className="surface-cream rounded-radius-card border border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-ink">{o.name} · {o.swingType}</p>
              <p className="text-xs text-muted">
                {o.email} · {o.phone} ·{" "}
                {new Date(o.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {o.budget != null && (
                <span className="text-sm font-semibold text-ink">{formatINR(o.budget)}</span>
              )}
              <select
                value={o.status}
                onChange={(e) => patch(o.id, { status: e.target.value })}
                className="h-9 rounded-lg border border-line bg-cream px-3 text-xs focus:border-wood focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <dl className="mt-3 grid gap-x-8 gap-y-1 border-t border-line pt-3 text-xs text-muted sm:grid-cols-2">
            {o.size && <div><dt className="inline">Size:</dt> <dd className="inline text-ink">{o.size}</dd></div>}
            {o.material && <div><dt className="inline">Material:</dt> <dd className="inline text-ink">{o.material}</dd></div>}
            {o.finish && <div><dt className="inline">Finish:</dt> <dd className="inline text-ink">{o.finish}</dd></div>}
            {o.color && <div><dt className="inline">Colour:</dt> <dd className="inline text-ink">{o.color}</dd></div>}
          </dl>
          <p className="mt-3 text-sm leading-6 text-ink/85">{o.description}</p>
          <label className="mt-3 flex flex-col gap-1.5 text-xs">
            <span className="font-medium text-muted">Admin notes</span>
            <textarea
              rows={2}
              defaultValue={o.adminNotes ?? ""}
              onBlur={(e) => {
                if (e.target.value !== (o.adminNotes ?? "")) {
                  patch(o.id, { adminNotes: e.target.value });
                }
              }}
              className="resize-none rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-wood focus:outline-none"
              placeholder="Notes for the customer…"
            />
          </label>
        </div>
      ))}
    </div>
  );
}