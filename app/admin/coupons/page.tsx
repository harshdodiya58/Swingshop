import type { Metadata } from "next";
import { CouponsClient } from "./coupons-client";

export const metadata: Metadata = { title: "Coupons — Admin", robots: { index: false } };

export default function AdminCouponsPage() {
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl text-ink">Coupons</h1>
        <p className="mt-1 text-sm text-muted">Create and manage discount codes for checkout.</p>
      </div>
      <CouponsClient />
    </div>
  );
}
