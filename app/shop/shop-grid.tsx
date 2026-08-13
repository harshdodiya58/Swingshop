import { getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ui/product-card";

export async function ShopGrid({
  categorySlug,
  searchParams,
}: {
  categorySlug?: string;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const sort = typeof params?.sort === "string" ? params.sort : "popular";

  const products = await getProducts({
    ...(categorySlug ? { categorySlug } : {}),
  });

  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      break;
    default:
      sorted.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || b.rating - a.rating);
  }

  if (sorted.length === 0) {
    return (
      <div className="surface-cream flex flex-col items-center gap-3 rounded-radius-card border border-dashed border-line px-6 py-20 text-center">
        <h2 className="font-display text-xl text-ink">No swings here yet</h2>
        <p className="max-w-sm text-sm text-muted">
          This collection is being handcrafted. Explore our other categories —
          or tell us exactly what you need.
        </p>
        <a
          href="/custom-order"
          className="mt-2 rounded-full bg-wood px-5 py-2 text-sm font-medium text-white hover:bg-wood-deep"
        >
          Start a custom order
        </a>
      </div>
    );
  }

  return (
    <section aria-label="Products">
      <p className="mb-4 text-sm text-muted">
        {sorted.length} {sorted.length === 1 ? "swing" : "swings"}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}