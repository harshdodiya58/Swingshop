import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const images = await db.galleryImage.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json({ data: images });
}

const galleryInput = z.object({
  title: z.string().trim().max(200).optional().nullable(),
  image: z.string().url().max(500),
  alt: z.string().trim().max(300).optional().nullable(),
  category: z.string().trim().min(2).max(80),
  sortOrder: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = galleryInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  const image = await db.galleryImage.create({
    data: {
      title: d.title ?? null,
      image: d.image,
      alt: d.alt ?? null,
      category: d.category,
      sortOrder: d.sortOrder,
      featured: d.featured,
    },
  });
  return NextResponse.json({ data: image }, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const parsed = galleryInput.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const image = await db.galleryImage.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.image !== undefined && { image: d.image }),
        ...(d.alt !== undefined && { alt: d.alt }),
        ...(d.category !== undefined && { category: d.category }),
        ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
        ...(d.featured !== undefined && { featured: d.featured }),
      },
    });
    return NextResponse.json({ data: image });
  } catch {
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
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
    await db.galleryImage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
