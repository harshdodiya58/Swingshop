import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { orderStatusSchema } from "../order-status";
import type { OrderStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const orders = await db.order.findMany({
    where: status ? { status: status as OrderStatus } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      items: true,
      payment: true,
    },
  });
  return NextResponse.json({ data: orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const input = z
    .object({
      id: z.string(),
      status: orderStatusSchema,
    })
    .safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Invalid input", issues: input.error.issues }, { status: 400 });
  }
  try {
    const order = await db.order.update({
      where: { id: input.data.id },
      data: { status: input.data.status },
    });
    return NextResponse.json({ data: order });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}