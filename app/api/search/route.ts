import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ data: [] });
  }
  const products = await searchProducts(q.trim(), 24);
  return NextResponse.json({ data: products });
}