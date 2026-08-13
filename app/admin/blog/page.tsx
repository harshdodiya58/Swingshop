import type { Metadata } from "next";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = { title: "Blog — Admin", robots: { index: false } };

export default function AdminBlogPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Blog</h1>
        <p className="mt-1 text-sm text-muted">Write and manage posts for the journal.</p>
      </div>
      <BlogClient />
    </div>
  );
}
