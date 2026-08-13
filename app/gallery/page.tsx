import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/queries";
import { Container } from "@/components/ui/container";
import GalleryClient from "./gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Real swings in real homes — customer installs, workshop photography and custom pieces from Shree Chamunda Swings.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">Gallery</span>
          <h1 className="font-display text-display-sm text-ink">
            Heirlooms in the wild
          </h1>
          <p className="max-w-xl text-muted">
            Customer homes, workshop bench shots and custom commissions.
          </p>
        </Container>
      </header>
      <GalleryClient images={images} />
    </div>
  );
}