import type { Metadata } from "next";
import { CustomOrdersClient } from "./custom-orders-client";

export const metadata: Metadata = { title: "Custom Orders — Admin", robots: { index: false } };

export default function AdminCustomOrdersPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Custom Orders</h1>
        <p className="mt-1 text-sm text-muted">Bespoke swing requests from the custom order form.</p>
      </div>
      <CustomOrdersClient />
    </div>
  );
}