import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(99),
        size: z.string().optional(),
        color: z.string().optional(),
        finish: z.string().optional(),
      }),
    )
    .min(1),
  couponCode: z.string().trim().max(40).optional(),
});

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await db.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));
  if (productIds.some((id) => !productMap.has(id))) {
    return NextResponse.json({ error: "One or more products not found" }, { status: 400 });
  }

  let subtotal = 0;
  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `"${product.name}" has only ${product.stock} in stock` }, { status: 400 });
    }
    subtotal += product.price * item.quantity;
  }

  // Coupon
  let discount = 0;
  if (parsed.data.couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: parsed.data.couponCode.toUpperCase() },
    });
    if (coupon?.active && (!coupon.expiresAt || coupon.expiresAt > new Date()) && subtotal >= coupon.minOrder) {
      discount = coupon.type === "PERCENT"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  const deliveryFee = subtotal - discount >= 20000 ? 0 : 499;
  const total = subtotal - discount + deliveryFee;
  const orderNumber = `SCS-${Date.now().toString(36).toUpperCase()}`;

  const order = await db.order.create({
    data: {
      orderNumber,
      userId,
      subtotal,
      deliveryFee,
      discount,
      total,
      couponCode: parsed.data.couponCode?.toUpperCase() ?? null,
      items: {
        create: parsed.data.items.map((item) => {
          const product = productMap.get(item.productId)!;
          return {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            finish: item.finish,
            image: product.images[0] ?? null,
          };
        }),
      },
    },
  });

  return NextResponse.json({ data: { orderId: order.id, orderNumber, total } }, { status: 201 });
}