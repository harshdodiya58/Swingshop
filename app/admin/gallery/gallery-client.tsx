"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type GalleryImage = {
  id: string;
  title: string | null;
  image: string;
  alt: string | null;
  category: string;
  sortOrder: number;
  featured: boolean;
};

const empty = { title: "", image: "", alt: "", category: "Garden", sortOrder: 0, featured: false };

const categories = ["Garden", "Bedroom", "Rooftop", "Showroom", "Custom"];

export function GalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/gallery");
    const json = await res.json();
    if (res.ok) setImages(json.data);
    else setError(json.error ?? "Failed to load gallery");
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/gallery")
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (res.ok) setImages(json.data);
        else setError(json.error ?? "Failed to load gallery");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load gallery");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function addImage(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title || null,
        image: form.image,
        alt: form.alt || null,
        category: form.category,
        sortOrder: Number(form.sortOrder),
        featured: form.featured,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error ?? "Failed to add image");
      return;
    }
    setForm({ ...empty });
    await load();
  }

  async function remove(img: GalleryImage) {
    if (!confirm("Remove this image from the gallery?")) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: img.id }),
    });
    await load();
  }

  const input = "h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-wood focus:outline-none";
  const label = "flex flex-col gap-1 text-xs font-medium text-muted";

  return (
    <div className="mt-6 flex flex-col gap-8">
      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={addImage} className="surface-cream rounded-radius-card border border-line p-5">
        <h2 className="font-display text-lg text-ink">Add image</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className={label}>
            Image URL
            <input required type="url" className={input} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
          </label>
          <label className={label}>
            Title (optional)
            <input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className={label}>
            Alt text (optional)
            <input className={input} value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
          </label>
          <label className={label}>
            Category
            <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Sort order
            <input type="number" min={0} className={input} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value === "" ? 0 : Number(e.target.value) })} />
          </label>
          <label className="flex items-end gap-2 pb-1 text-xs font-medium text-muted">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-wood" />
            Featured
          </label>
        </div>
        <button type="submit" disabled={saving} className="mt-4 h-10 rounded-full bg-wood px-6 text-sm font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60">
          {saving ? "Adding…" : "Add image"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Loading gallery…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-muted">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="surface-cream overflow-hidden rounded-radius-card border border-line">
              <div className="relative aspect-[4/3] bg-ivory">
                <Image src={img.image} alt={img.alt ?? img.title ?? ""} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
                {img.featured && (
                  <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-wood-deep">Featured</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink">{img.title || img.category}</p>
                <p className="mt-0.5 text-xs text-muted">{img.category} · order {img.sortOrder}</p>
                <button type="button" onClick={() => remove(img)} className="mt-2 text-xs font-medium text-red-700 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
