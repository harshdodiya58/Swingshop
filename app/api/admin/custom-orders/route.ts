import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import type { CustomOrderStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const orders = await db.customOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body: unknown = await request.json().catch(() => ({}));
  const { id, status, adminNotes } = (body ?? {}) as {
    id?: unknown;
    status?: unknown;
    adminNotes?: unknown;
  };
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const updated = await db.customOrder.update({
      where: { id },
      data: {
        ...(typeof status === "string" && isCustomOrderStatus(status)
          ? { status }
          : {}),
        ...(typeof adminNotes === "string" ? { adminNotes } : {}),
      },
    });
    return NextResponse.json({ data: updated });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

const validStatuses = new Set<CustomOrderStatus>([
  "NEW",
  "IN_REVIEW",
  "QUOTED",
  "ACCEPTED",
  "IN_PRODUCTION",
  "COMPLETED",
  "DECLINED",
]);

function isCustomOrderStatus(value: string): value is CustomOrderStatus {
  return validStatuses.has(value as CustomOrderStatus);
}