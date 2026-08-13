import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminSidebar } from "./admin-sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/login");

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
