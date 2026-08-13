import type { Metadata } from "next";
import { CustomersClient } from "./customers-client";

export const metadata: Metadata = { title: "Customers — Admin", robots: { index: false } };

export default function AdminCustomersPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Customers</h1>
        <p className="mt-1 text-sm text-muted">Everyone who has created an account on the site.</p>
      </div>
      <CustomersClient />
    </div>
  );
}
