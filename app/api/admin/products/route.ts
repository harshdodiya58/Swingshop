import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true, slug: true } }, _count: { select: { orderItems: true } } },
  });
  return NextResponse.json({ data: products });
}

const productInput = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(200),
  sku: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().min(10).max(10000),
  shortDescription: z.string().trim().min(2).max(400),
  price: z.coerce.number().int().min(1),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  categoryId: z.string(),
  material: z.string().trim().min(2).max(80),
  images: z.array(z.string().url()).max(12).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  finishes: z.array(z.string()).default([]),
  stock: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = productInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const data = parsed.data;
  try {
    const product = await db.product.create({
      data: {
        ...data,
        sku: data.sku ?? `SCS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      },
    });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "A product with that slug or SKU already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}