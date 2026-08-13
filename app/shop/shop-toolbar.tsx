"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
] as const;

export function ShopToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") ?? "popular");

  function updateSort(value: string) {
    setSort(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "popular") params.delete("sort");
    else params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between border-b border-line pb-4">
      <p className="text-sm text-muted">
        Handcrafted to order · ships pan-India
      </p>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted">Sort by</span>
        <span className="relative">
          <select
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
            className="appearance-none rounded-full border border-line bg-cream py-2 pl-4 pr-9 text-sm text-ink focus:border-wood focus:outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wood" aria-hidden />
        </span>
      </label>
    </div>
  );
}