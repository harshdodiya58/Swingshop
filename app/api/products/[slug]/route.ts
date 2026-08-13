import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, name: true } },
      reviews: {
        select: {
          id: true, rating: true, title: true, body: true,
          verified: true, createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      variants: true,
    },
  });
  if (!product) return notFound();
  return NextResponse.json({ data: product });
}