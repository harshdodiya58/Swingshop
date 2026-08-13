import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      excerpt: true,
      coverImage: true,
      published: true,
      publishedAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ data: posts });
}

const blogInput = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().trim().min(20),
  coverImage: z.string().url().max(500),
  author: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(300).optional().nullable(),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = blogInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const post = await db.blogPost.create({
      data: {
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt,
        content: d.content,
        coverImage: d.coverImage,
        author: d.author,
        category: d.category,
        tags: d.tags,
        published: d.published,
        publishedAt: d.published ? new Date() : null,
        seoTitle: d.seoTitle ?? null,
        seoDescription: d.seoDescription ?? null,
      },
    });
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "A post with that slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const parsed = blogInput.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  const published = d.published ?? existing.published;
  try {
    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.slug !== undefined && { slug: d.slug }),
        ...(d.excerpt !== undefined && { excerpt: d.excerpt }),
        ...(d.content !== undefined && { content: d.content }),
        ...(d.coverImage !== undefined && { coverImage: d.coverImage }),
        ...(d.author !== undefined && { author: d.author }),
        ...(d.category !== undefined && { category: d.category }),
        ...(d.tags !== undefined && { tags: d.tags }),
        ...(d.published !== undefined && { published: d.published }),
        ...(d.seoTitle !== undefined && { seoTitle: d.seoTitle }),
        ...(d.seoDescription !== undefined && { seoDescription: d.seoDescription }),
        ...(published !== existing.published && {
          publishedAt: published ? new Date() : null,
        }),
      },
    });
    return NextResponse.json({ data: post });
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "A post with that slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
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
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
