export function ShopGridSkeleton() {
  return (
    <section aria-label="Loading products" aria-busy="true">
      <div className="mb-4 h-4 w-24 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="surface-cream overflow-hidden rounded-radius-card shadow-soft"
          >
            <div className="aspect-[4/5] animate-pulse bg-border" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-2 w-16 animate-pulse rounded bg-border" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-border" />
              <div className="h-5 w-24 animate-pulse rounded bg-border" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}