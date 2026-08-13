import type { MetadataRoute } from "next";
import { db } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/custom-order`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/craftsmanship`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/shipping`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/returns`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/warranty`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const [categories, products, posts] = await Promise.all([
    db.category.findMany({ select: { slug: true } }),
    db.product.findMany({ select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/shop/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}