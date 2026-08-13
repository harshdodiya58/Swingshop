"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Hammer,
  Users,
  TicketPercent,
  Images,
  Newspaper,
  Inbox,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

type NavGroup = { group: string; items: readonly NavItem[] };

const sections: readonly NavGroup[] = [
  { group: "Store", items: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/custom-orders", label: "Custom Orders", icon: Hammer },
    { href: "/admin/products", label: "Products", icon: ClipboardList },
    { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  ]},
  { group: "Content", items: [
    { href: "/admin/gallery", label: "Gallery", icon: Images },
    { href: "/admin/blog", label: "Blog", icon: Newspaper },
  ]},
  { group: "People", items: [
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/contact", label: "Contact Inquiries", icon: Inbox },
  ]},
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-cream">
      <div className="flex h-16 items-center gap-2 border-b border-line px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wood font-display text-sm text-white">
          SC
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm text-ink">Chamunda Admin</p>
          <p className="text-[10px] uppercase tracking-wide text-muted">Control panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="eyebrow px-3 text-[10px] text-muted">{group.group}</p>
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-wood text-white"
                          : "text-ink/70 hover:bg-wood/10 hover:text-wood-deep",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-wood/10 hover:text-wood-deep"
        >
          <Home className="h-4 w-4" aria-hidden />
          View site
        </Link>
      </div>
    </aside>
  );
}
