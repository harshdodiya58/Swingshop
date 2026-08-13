import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const inquiries = await db.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
    take: 200,
  });
  const data = inquiries.map((q) => ({
    id: q.id,
    name: q.name,
    email: q.email,
    phone: q.phone,
    product: q.product,
    message: q.message,
    handled: q.handled,
    createdAt: q.createdAt,
    user: q.user,
  }));
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const id = body?.id;
  const handled = body?.handled;
  if (!id || typeof handled !== "boolean") {
    return NextResponse.json({ error: "Missing id or handled" }, { status: 400 });
  }
  try {
    const inquiry = await db.contactInquiry.update({ where: { id }, data: { handled } });
    return NextResponse.json({ data: inquiry });
  } catch {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
