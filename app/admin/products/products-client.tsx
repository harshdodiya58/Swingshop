"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  category: { name: string; slug: string } | null;
  _count?: { orderItems: number };
};

export function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load");
        setProducts(json.data);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mt-6 text-sm text-muted">Loading products…</p>;

  return (
    <div className="mt-6">
      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-wood px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-wood-deep"
        >
          {showForm ? "Close form" : "Add product"}
        </button>
      </div>

      {showForm && <ProductForm />}

      <div className="overflow-x-auto rounded-radius-card border border-line surface-cream">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-4 py-3 text-muted">{p.sku}</td>
                <td className="px-4 py-3 text-muted">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-ink">{formatINR(p.price)}</td>
                <td className="px-4 py-3 text-muted">{p.stock}</td>
                <td className="px-4 py-3 text-muted">
                  {p.isFeatured && <span className="mr-2 rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage-deep">Featured</span>}
                  {p.isBestseller && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-wood-deep">Bestseller</span>}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      name: data.name,
      slug: data.slug,
      sku: String(data.sku || ""),
      description: data.description,
      shortDescription: data.shortDescription,
      price: Number(data.price),
      categoryId: String(data.categoryId),
      material: data.material,
      stock: Number(data.stock || 0),
      images: String(data.images || "").split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      setMessage({ ok: true, text: `Created ${json.data.name}.` });
      form.reset();
    } else {
      setMessage({ ok: false, text: json.error ?? "Failed to create product" });
    }
  }

  const fieldClass =
    "h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-wood focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-radius-card border border-line surface-cream p-6 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Name *<input name="name" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Slug *<input name="slug" required placeholder="my-swing" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        SKU<input name="sku" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Category ID *<input name="categoryId" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Price (₹) *<input name="price" required type="number" min={1} className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Material *<input name="material" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted">
        Stock<input name="stock" type="number" min={0} defaultValue={0} className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted sm:col-span-2">
        Image URLs (comma-separated)<input name="images" placeholder="https://…, https://…" className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted sm:col-span-2">
        Short description *<input name="shortDescription" required className={fieldClass} />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-muted sm:col-span-2">
        Description *<textarea name="description" required rows={3} className="resize-none rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-wood focus:outline-none" />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-wood px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Creating…" : "Create product"}
        </button>
        {message && (
          <p className={`text-sm ${message.ok ? "text-emerald-700" : "text-red-700"}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}