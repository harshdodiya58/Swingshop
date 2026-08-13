import type { Metadata } from "next";
import { OrdersClient } from "./orders-client";

export const metadata: Metadata = { title: "Orders — Admin", robots: { index: false } };

export default function AdminOrdersPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Orders</h1>
        <p className="mt-1 text-sm text-muted">All orders placed on the store, with live status control.</p>
      </div>
      <OrdersClient />
    </div>
  );
}
