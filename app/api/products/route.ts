import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured") === "true";
  const bestseller = searchParams.get("bestseller") === "true";
  const take = Math.min(Number(searchParams.get("take") ?? 20), 50);

  const where = {
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { shortDescription: { contains: q, mode: "insensitive" as const } },
            { material: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(featured ? { isFeatured: true } : {}),
    ...(bestseller ? { isBestseller: true } : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: { category: { select: { slug: true, name: true } } },
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    data: products,
    meta: { total, take, category, q, featured, bestseller },
  });
}