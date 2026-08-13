import type { Metadata } from "next";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = { title: "Gallery — Admin", robots: { index: false } };

export default function AdminGalleryPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Gallery</h1>
        <p className="mt-1 text-sm text-muted">Manage the photos shown on the public gallery page.</p>
      </div>
      <GalleryClient />
    </div>
  );
}
