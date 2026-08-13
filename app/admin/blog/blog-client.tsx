"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
};

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Shree Chamunda Swings",
  category: "Buying Guide",
  tags: "" as string,
  published: false,
};

export function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/blog");
    const json = await res.json();
    if (res.ok) setPosts(json.data);
    else setError(json.error ?? "Failed to load posts");
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/blog")
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (res.ok) setPosts(json.data);
        else setError(json.error ?? "Failed to load posts");
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load posts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage,
        author: form.author,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: form.published,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error ?? "Failed to create post");
      return;
    }
    setForm({ ...empty });
    setCreating(false);
    await load();
  }

  async function togglePublish(p: Post) {
    await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, published: !p.published }),
    });
    await load();
  }

  async function remove(p: Post) {
    if (!confirm(`Delete post "${p.title}"?`)) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    });
    await load();
  }

  const input = "h-10 rounded-lg border border-line bg-cream px-3 text-sm focus:border-wood focus:outline-none";
  const textarea = "rounded-lg border border-line bg-cream px-3 py-2 text-sm focus:border-wood focus:outline-none";
  const label = "flex flex-col gap-1 text-xs font-medium text-muted";

  return (
    <div className="mt-6 flex flex-col gap-6">
      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      {creating ? (
        <form onSubmit={createPost} className="surface-cream rounded-radius-card border border-line p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">New blog post</h2>
            <button type="button" onClick={() => setCreating(false)} className="text-sm text-muted hover:text-ink">
              Cancel
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Title
              <input required className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className={label}>
              Slug
              <input required className={input} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. how-to-choose-a-swing" />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Excerpt
              <input required className={input} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Cover image URL
              <input required type="url" className={input} value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
            </label>
            <label className={label}>
              Author
              <input className={input} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </label>
            <label className={label}>
              Category
              <input className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Tags (comma separated)
              <input className={input} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="materials, maintenance" />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Content (supports paragraphs; blank line between sections)
              <textarea required rows={8} className={textarea} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </label>
            <label className="flex items-end gap-2 pb-1 text-xs font-medium text-muted">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-wood" />
              Publish now
            </label>
          </div>
          <button type="submit" disabled={saving} className="mt-4 h-10 rounded-full bg-wood px-6 text-sm font-medium text-white transition-colors hover:bg-wood-deep disabled:opacity-60">
            {saving ? "Saving…" : "Create post"}
          </button>
        </form>
      ) : (
        <div>
          <button type="button" onClick={() => setCreating(true)} className="h-10 rounded-full bg-wood px-6 text-sm font-medium text-white transition-colors hover:bg-wood-deep">
            New post
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <div key={p.id} className="surface-cream flex flex-wrap items-center gap-4 rounded-radius-card border border-line p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ivory">
                <Image src={p.coverImage} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{p.title}</p>
                <p className="truncate text-xs text-muted">{p.category} · {p.excerpt}</p>
                <p className="text-[11px] text-muted">
                  {p.published ? (
                    <span className="font-semibold text-emerald-600">Published</span>
                  ) : (
                    <span className="font-semibold text-red-600">Draft</span>
                  )}
                  {" · "}{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/blog/${p.slug}`} target="_blank" className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-wood hover:text-wood-deep">
                  View
                </Link>
                <button type="button" onClick={() => togglePublish(p)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-wood hover:text-wood-deep">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" onClick={() => remove(p)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50">
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
