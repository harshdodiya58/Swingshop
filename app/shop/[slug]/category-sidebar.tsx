import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function CategorySidebar({ currentSlug }: { currentSlug: string }) {
  const categories = await getCategories();
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <nav aria-label="Categories">
          <h2 className="eyebrow mb-4 text-wood">Categories</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/shop"
                className="block rounded-lg px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-wood/5 hover:text-wood-deep"
              >
                All Swings
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    c.slug === currentSlug
                      ? "bg-wood/10 font-medium text-wood-deep"
                      : "text-ink/75 hover:bg-wood/5 hover:text-wood-deep",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}