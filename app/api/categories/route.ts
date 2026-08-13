import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ data: categories });
}