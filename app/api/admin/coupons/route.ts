import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: coupons });
}

const couponInput = z.object({
  code: z.string().trim().toUpperCase().min(2).max(40),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.coerce.number().int().min(1),
  minOrder: z.coerce.number().int().min(0).default(0),
  maxDiscount: z.coerce.number().int().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(1).optional().nullable(),
  active: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = couponInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const coupon = await db.coupon.create({
      data: {
        code: d.code,
        type: d.type,
        value: d.value,
        minOrder: d.minOrder,
        maxDiscount: d.maxDiscount ?? null,
        usageLimit: d.usageLimit ?? null,
        active: d.active,
        startsAt: d.startsAt ? new Date(d.startsAt) : null,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
      },
    });
    return NextResponse.json({ data: coupon }, { status: 201 });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "That coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const parsed = couponInput.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const coupon = await db.coupon.update({
      where: { id },
      data: {
        ...(d.code !== undefined && { code: d.code }),
        ...(d.type !== undefined && { type: d.type }),
        ...(d.value !== undefined && { value: d.value }),
        ...(d.minOrder !== undefined && { minOrder: d.minOrder }),
        ...(d.maxDiscount !== undefined && { maxDiscount: d.maxDiscount }),
        ...(d.usageLimit !== undefined && { usageLimit: d.usageLimit }),
        ...(d.active !== undefined && { active: d.active }),
        ...(d.startsAt !== undefined && { startsAt: d.startsAt ? new Date(d.startsAt) : null }),
        ...(d.expiresAt !== undefined && { expiresAt: d.expiresAt ? new Date(d.expiresAt) : null }),
      },
    });
    return NextResponse.json({ data: coupon });
  } catch {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
