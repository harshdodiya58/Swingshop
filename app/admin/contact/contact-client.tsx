"use client";

import { useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  product: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
  user: { name: string; email: string } | null;
};

export function ContactClient() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/contact");
    const json = await res.json();
    if (res.ok) setItems(json.data);
    else setError(json.error ?? "Failed to load inquiries");
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/contact")
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (res.ok) setItems(json.data);
        else setError(json.error ?? "Failed to load inquiries");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load inquiries");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleHandled(q: Inquiry) {
    await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: q.id, handled: !q.handled }),
    });
    await load();
  }

  if (loading) return <p className="mt-6 text-sm text-muted">Loading inquiries…</p>;
  if (error) return <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>;

  if (items.length === 0) {
    return <p className="mt-6 text-sm text-muted">No inquiries yet.</p>;
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {items.map((q) => (
        <div key={q.id} className={`surface-cream rounded-radius-card border p-5 ${q.handled ? "border-line opacity-70" : "border-wood/30"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink">{q.name}</p>
              <p className="text-xs text-muted">
                {q.email}{q.phone ? ` · ${q.phone}` : ""}
                {q.user && <span className="ml-2 rounded-full bg-sage/20 px-2 py-0.5 text-[10px] font-semibold text-sage">Account</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${q.handled ? "bg-emerald-100 text-emerald-700" : "bg-gold/20 text-wood-deep"}`}>
                {q.handled ? "Handled" : "New"}
              </span>
              <span className="text-xs text-muted">
                {new Date(q.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            </div>
          </div>
          {q.product && <p className="mt-2 text-xs font-medium text-wood-deep">Product: {q.product}</p>}
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink/85">{q.message}</p>
          <button
            type="button"
            onClick={() => toggleHandled(q)}
            className="mt-3 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-wood hover:text-wood-deep"
          >
            {q.handled ? "Mark as unhandled" : "Mark as handled"}
          </button>
        </div>
      ))}
    </div>
  );
}
