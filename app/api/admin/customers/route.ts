import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const users = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true, customOrders: true, contactInquiries: true } },
    },
  });
  const data = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    image: u.image,
    createdAt: u.createdAt,
    orderCount: u._count.orders,
    customOrderCount: u._count.customOrders,
    contactCount: u._count.contactInquiries,
  }));
  return NextResponse.json({ data });
}
