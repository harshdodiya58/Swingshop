import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ data: posts });
}