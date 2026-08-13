import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { ShopSidebar } from "./shop-sidebar";
import { ShopGrid } from "./shop-grid";
import { ShopToolbar } from "./shop-toolbar";
import { ShopGridSkeleton } from "./shop-grid-skeleton";

export const metadata: Metadata = {
  title: "Shop All Swings",
  description:
    "Browse our full collection of handcrafted wooden, outdoor, indoor, metal, garden swings and hanging chairs.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const categories = await getCategories();
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center sm:px-6 lg:px-8">
          <span className="eyebrow text-wood">The Collection</span>
          <h1 className="font-display text-display-sm text-ink">Every swing we build</h1>
          <p className="max-w-xl text-muted">
            Each piece is handcrafted to order by our artisans. Select a
            category, filter by wood and size, and find the jhula for your home.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <ShopSidebar categories={categories} />

        <div className="flex flex-col gap-8">
          <ShopToolbar />
          <Suspense fallback={<ShopGridSkeleton />}>
            <ShopGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}