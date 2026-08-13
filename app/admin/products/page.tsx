import type { Metadata } from "next";
import { ProductsClient } from "./products-client";

export const metadata: Metadata = { title: "Products — Admin", robots: { index: false } };

export default function AdminProductsPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <p className="mt-1 text-sm text-muted">Add and manage the swings in your catalogue.</p>
      </div>
      <ProductsClient />
    </div>
  );
}