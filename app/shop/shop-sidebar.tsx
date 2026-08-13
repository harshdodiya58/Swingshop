import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShopSidebar({ categories }: { categories: { slug: string; name: string }[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-8">
        <nav aria-label="Categories">
          <h2 className="eyebrow mb-4 text-wood">Categories</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/shop"
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  "bg-wood/10 font-medium text-wood-deep",
                )}
              >
                All Swings
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-wood/5 hover:text-wood-deep"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4 flex items-center gap-2 text-wood">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
          </h2>
          <p className="text-sm leading-6 text-muted">
            Material, size and colour filters arrive with the next build stage.
          </p>
        </div>
      </div>
    </aside>
  );
}