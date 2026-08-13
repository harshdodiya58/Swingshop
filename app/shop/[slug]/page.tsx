import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/queries";
import { ShopGrid } from "../shop-grid";
import { CategorySidebar } from "./category-sidebar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? undefined,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center sm:px-6 lg:px-8">
          <span className="eyebrow text-wood">Collection</span>
          <h1 className="font-display text-display-sm text-ink">{category.name}</h1>
          <p className="max-w-xl text-muted">{category.description}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <CategorySidebar currentSlug={slug} />
        <ShopGrid categorySlug={slug} />
      </div>
    </div>
  );
}