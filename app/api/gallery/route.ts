import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const images = await db.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ data: images });
}