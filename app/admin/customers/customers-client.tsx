"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
  orderCount: number;
  customOrderCount: number;
  contactCount: number;
};

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/customers")
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) setError(json.error ?? "Failed to load customers");
        else setCustomers(json.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load customers");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="mt-6 text-sm text-muted">Loading customers…</p>;
  if (error) return <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>;

  if (customers.length === 0) {
    return <p className="mt-6 text-sm text-muted">No customers yet.</p>;
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="py-3 pr-4 font-medium">Customer</th>
            <th className="py-3 pr-4 font-medium">Contact</th>
            <th className="py-3 pr-4 font-medium">Orders</th>
            <th className="py-3 pr-4 font-medium">Custom</th>
            <th className="py-3 pr-4 font-medium">Inquiries</th>
            <th className="py-3 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b border-line/70">
              <td className="py-3 pr-4">
                <p className="font-medium text-ink">{c.name}</p>
                <p className="text-xs text-muted">{c.id.slice(0, 8)}</p>
              </td>
              <td className="py-3 pr-4">
                <p className="text-ink">{c.email}</p>
                {c.phone && <p className="text-xs text-muted">{c.phone}</p>}
              </td>
              <td className="py-3 pr-4 text-ink">{c.orderCount}</td>
              <td className="py-3 pr-4 text-ink">{c.customOrderCount}</td>
              <td className="py-3 pr-4 text-ink">{c.contactCount}</td>
              <td className="py-3 text-muted">
                {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
