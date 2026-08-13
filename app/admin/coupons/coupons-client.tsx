"use client";

import { useEffect, useState } from "react";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
  startsAt: string | null;
  expiresAt: string | null;
};

const empty = {
  code: "",
  type: "PERCENT",
  value: 10,
  minOrder: 0 as string | number,
  maxDiscount: "" as string | number,
  usageLimit: "" as string | number,
  active: true,
  expiresAt: "",
};

export function CouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/coupons");
    const json = await res.json();
    if (res.ok) setCoupons(json.data);
    else setError(json.error ?? "Failed to load coupons");
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/coupons")
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (res.ok) setCoupons(json.data);
        else setError(json.error ?? "Failed to load coupons");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load coupons");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),
        usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
        active: form.active,
        expiresAt: form.expiresAt || null,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error ?? "Failed to create coupon");
      return;
    }
    setForm({ ...empty });
    await load();
  }

  async function toggleActive(c: Coupon) {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    });
    await load();
  }

  async function remove(c: Coupon) {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id }),
    });
    await load();
  }

  const input =
    "h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-wood focus:outline-none";
  const label = "flex flex-col gap-1 text-xs font-medium text-muted";

  return (
    <div className="mt-6 flex flex-col gap-8">
      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={createCoupon} className="surface-cream rounded-radius-card border border-line p-5">
        <h2 className="font-display text-lg text-ink">Create coupon</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={label}>
            Code
            <input required className={input} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE10" />
          </label>
          <label className={label}>
            Type
            <select className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="PERCENT">Percent off</option>
              <option value="FLAT">Flat amount</option>
            </select>
          </label>
          <label className={label}>
            Value {form.type === "PERCENT" ? "(%)" : "(₹)"}
            <input required type="number" min={1} className={input} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value === "" ? 0 : Number(e.target.value) })} />
          </label>
          <label className={label}>
            Min order (₹)
            <input type="number" min={0} className={input} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value === "" ? "" : Number(e.target.value) })} />
          </label>
          <label className={label}>
            Max discount (₹, optional)
            <input type="number" min={0} className={input} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="Leave blank for none" />
          </label>
          <label className={label}>
            Usage limit (optional)
            <input type="number" min={1} className={input} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="Unlimited" />
          </label>
          <label className={label}>
            Expires (optional)
            <input type="datetime-local" className={input} value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </label>
          <label className="flex items-end gap-2 pb-1 text-xs font-medium text-muted">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-wood" />
            Active
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 h-10 rounded-full bg-wood px-6 text-sm font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60"
        >
          {saving ? "Saving…" : "Create coupon"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Loading coupons…</p>
      ) : coupons.length === 0 ? (
        <p className="text-sm text-muted">No coupons yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {coupons.map((c) => (
            <div key={c.id} className="surface-cream flex flex-wrap items-center justify-between gap-3 rounded-radius-card border border-line p-4">
              <div>
                <p className="font-medium text-ink">
                  {c.code}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {c.type === "PERCENT" ? `${c.value}% off` : `₹${c.value} off`}
                  {c.minOrder > 0 ? ` · min ₹${c.minOrder}` : ""}
                  {c.maxDiscount ? ` · cap ₹${c.maxDiscount}` : ""}
                  {" · "}{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""} used
                  {c.expiresAt ? ` · expires ${new Date(c.expiresAt).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(c)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-wood hover:text-wood-deep"
                >
                  {c.active ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
