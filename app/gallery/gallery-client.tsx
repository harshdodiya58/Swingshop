"use client";

import { useState } from "react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/queries";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const filters = ["All", "Indoor", "Outdoor", "Wooden", "Metal", "Customer Homes", "Custom Orders"] as const;

export default function GalleryClient({
  images,
}: {
  images: Awaited<ReturnType<typeof getGalleryImages>>;
}) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "All" ? images : images.filter((i) => i.category === active);

  return (
    <Container className="py-14">
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              active === f
                ? "border-wood bg-wood text-white"
                : "border-line bg-cream text-ink hover:border-wood",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No photos in this category yet — we&apos;re still unpacking the workshop album.
        </p>
      ) : (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightbox(idx)}
              className="group relative mb-5 block w-full overflow-hidden rounded-radius-card shadow-soft"
            >
              <Image
                src={img.image}
                alt={img.alt ?? img.title ?? "Gallery image"}
                width={600}
                height={450}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.title && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sage/80 to-transparent p-4 text-left text-sm text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                  {img.title}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full bg-ivory/10 p-3 text-ivory hover:bg-ivory/20"
          >
            ✕
          </button>
          <div className="max-h-[85vh] max-w-4xl overflow-hidden rounded-radius-card" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightbox].image}
              alt={filtered[lightbox].alt ?? filtered[lightbox].title ?? ""}
              width={1200}
              height={900}
              className="h-auto w-full object-contain"
            />
            {filtered[lightbox].title && (
              <p className="bg-ivory px-5 py-3 text-center text-sm text-ink">
                {filtered[lightbox].title}
              </p>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}