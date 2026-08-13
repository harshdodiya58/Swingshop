import Link from "next/link";
import { getDashboardStats } from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue", value: formatINR(stats.revenue) },
    { label: "Orders", value: String(stats.orders) },
    { label: "Customers", value: String(stats.customers) },
    { label: "Custom Orders", value: String(stats.customOrders) },
    { label: "Products", value: String(stats.products) },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of your store at a glance.</p>
        </div>
        <Link href="/" className={buttonClasses({ variant: "outline", size: "sm" })}>
          View site
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="surface-cream rounded-radius-card border border-line p-5">
            <p className="text-xs uppercase tracking-wide text-muted">{c.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="surface-cream rounded-radius-card border border-line p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Pending payments</p>
          <p className="mt-2 font-display text-2xl text-ink">{stats.pendingPayments}</p>
        </div>
        <div className="surface-cream rounded-radius-card border border-line p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Low-stock products (≤3)</p>
          <p className="mt-2 font-display text-2xl text-ink">{stats.lowStock}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/orders" className={buttonClasses()}>
          Manage orders
        </Link>
        <Link href="/admin/custom-orders" className={buttonClasses({ variant: "outline" })}>
          Review custom orders
        </Link>
        <Link href="/admin/products" className={buttonClasses({ variant: "outline" })}>
          Manage products
        </Link>
      </div>
    </div>
  );
}
