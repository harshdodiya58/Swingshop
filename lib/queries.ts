import { cache } from "react";
import { db } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type CardRow = Prisma.ProductGetPayload<{ select: typeof cardSelect }>;

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  material: string;
  images: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isBestseller: boolean;
  stock: number;
  category: { slug: string; name: string } | null;
};

function toCard(p: CardRow): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    shortDescription: p.shortDescription,
    material: p.material,
    images: p.images,
    sizes: p.sizes,
    rating: p.rating,
    reviewCount: p.reviewCount,
    isBestseller: p.isBestseller,
    stock: p.stock,
    category: p.category,
  };
}

const cardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  compareAtPrice: true,
  shortDescription: true,
  material: true,
  images: true,
  sizes: true,
  rating: true,
  reviewCount: true,
  isBestseller: true,
  stock: true,
  category: { select: { slug: true, name: true } },
} as const;

export const getCategories = cache(async () => {
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return db.category.findUnique({ where: { slug } });
});

export const getProducts = cache(async (opts?: {
  categorySlug?: string;
  featured?: boolean;
  bestseller?: boolean;
  take?: number;
}) => {
  const where = {
    ...(opts?.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
    ...(opts?.featured ? { isFeatured: true } : {}),
    ...(opts?.bestseller ? { isBestseller: true } : {}),
  };
  const products = await db.product.findMany({
    where,
    select: cardSelect,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: opts?.take ?? 100,
  });
  return products.map(toCard);
});

export const getFeaturedProducts = cache(async (take = 8) => {
  const products = await db.product.findMany({
    where: { isFeatured: true },
    select: cardSelect,
    orderBy: { createdAt: "desc" },
    take,
  });
  return products.map(toCard);
});

export const getBestsellers = cache(async (take = 4) => {
  const products = await db.product.findMany({
    where: { isBestseller: true },
    select: cardSelect,
    orderBy: [{ rating: "desc" }, { name: "asc" }],
    take,
  });
  return products.map(toCard);
});

export const getProductBySlug = cache(async (slug: string) => {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, name: true } },
      reviews: {
        select: {
          id: true,
          rating: true,
          title: true,
          body: true,
          images: true,
          verified: true,
          createdAt: true,
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      variants: true,
    },
  });
  if (!product) return null;
  return product;
});

export const getRelatedProducts = cache(async (productId: string, categorySlug: string, take = 4) => {
  const products = await db.product.findMany({
    where: { category: { slug: categorySlug }, NOT: { id: productId } },
    select: cardSelect,
    orderBy: { rating: "desc" },
    take,
  });
  return products.map(toCard);
});

export const searchProducts = cache(async (query: string, take = 24) => {
  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
        { material: { contains: query, mode: "insensitive" } },
      ],
    },
    select: cardSelect,
    orderBy: { name: "asc" },
    take,
  });
  return products.map(toCard);
});

export const getBlogPosts = cache(async (opts?: { take?: number; category?: string }) => {
  const posts = await db.blogPost.findMany({
    where: {
      published: true,
      ...(opts?.category ? { category: opts.category } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: opts?.take ?? 100,
  });
  return posts;
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  return db.blogPost.findFirst({
    where: { slug, published: true },
    include: { relatedProducts: { include: { product: true } } },
  });
});

export const getGalleryImages = cache(async (category?: string) => {
  return db.galleryImage.findMany({
    where: category ? { category } : {},
    orderBy: { sortOrder: "asc" },
  });
});

export const getWishlistItems = cache(async (userId: string) => {
  const wishlist = await db.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: { select: cardSelect } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!wishlist) return [];
  return wishlist.items
    .map((i) => i.product)
    .map(toCard);
});

export const getProductCount = cache(async () => db.product.count());
export const getCustomerCount = cache(async () =>
  db.user.count({ where: { role: "CUSTOMER" } }));
export const getOrderCount = cache(async () => db.order.count());

export const getDashboardStats = cache(async () => {
  const [products, orders, customers, customOrders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.customOrder.count(),
  ]);
  const revenueAgg = await db.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } },
  });
  const pendingPayments = await db.payment.count({
    where: { status: "PENDING" },
  });
  const lowStock = await db.product.count({ where: { stock: { lte: 3 } } });
  return {
    products,
    orders,
    customers,
    customOrders,
    revenue: revenueAgg._sum.total ?? 0,
    pendingPayments,
    lowStock,
  };
});