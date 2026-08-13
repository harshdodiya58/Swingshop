"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import {
  contactSchema,
  customOrderSchema,
  newsletterSchema,
  registerSchema,
  type CustomOrderInput,
} from "@/lib/validations";

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error?: string; fieldErrors?: Record<string, string[]> };

function zodError(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = [];
    out[key].push(issue.message);
  }
  return out;
}

export type FormState = {
  ok: boolean;
  error: string | undefined;
  fieldErrors?: Record<string, string[]>;
};

/* ------------------------------------------------------------------ */
/* Registration                                                         */
/* ------------------------------------------------------------------ */

export async function registerUser(
  input: z.infer<typeof registerSchema>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please correct the highlighted fields", fieldErrors: zodError(parsed.error) };
  }
  const { name, email, password } = parsed.data;
  const passwordHash = await hash(password, 10);
  try {
    const user = await db.user.create({
      data: { name: name.trim(), email: email.toLowerCase(), passwordHash },
    });
    return { ok: true, data: { id: user.id } };
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return { ok: false, error: "An account with that email already exists" };
    }
    console.error("registerUser", e);
    return { ok: false, error: "Could not create your account. Please try again." };
  }
}

export async function registerFormAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await registerUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (result.ok) return { ok: true, error: undefined };
  return {
    ok: false,
    error: result.error,
    ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
  };
}

/* ------------------------------------------------------------------ */
/* Cart (guest-safe via anonymous session id for now; user-scoped when */
/* auth is active — uplifted to DB carts in the checkout stage).       */
/* ------------------------------------------------------------------ */

const cartItemInput = z.object({
  productSlug: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  size: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
});

export async function addToCart(
  input: z.infer<typeof cartItemInput>,
): Promise<ActionResult> {
  const parsed = cartItemInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid cart item", fieldErrors: zodError(parsed.error) };

  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "Please sign in to add items to your cart" };
  }

  const product = await db.product.findUnique({ where: { slug: parsed.data.productSlug } });
  if (!product) return { ok: false, error: "Product not found" };
  if (product.stock < parsed.data.quantity) {
    return { ok: false, error: "Only " + product.stock + " in stock" };
  }

  try {
    const cart = await db.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    const existing = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
        size: parsed.data.size ?? null,
        color: parsed.data.color ?? null,
        finish: parsed.data.finish ?? null,
      },
    });
    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parsed.data.quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: parsed.data.quantity,
          size: parsed.data.size,
          color: parsed.data.color,
          finish: parsed.data.finish,
        },
      });
    }
  } catch (e) {
    console.error("addToCart", e);
    return { ok: false, error: "Could not update cart" };
  }

  updateTag("cart");
  revalidatePath("/shop");
  return { ok: true, data: undefined };
}

export async function addToCartFormAction(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const quantity = Number(formData.get("quantity") ?? 1);
  return addToCart({
    productSlug: String(formData.get("productSlug") ?? ""),
    quantity: Number.isFinite(quantity) ? quantity : 1,
    size: (formData.get("size") as string) || undefined,
    color: (formData.get("color") as string) || undefined,
    finish: (formData.get("finish") as string) || undefined,
  });
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number,
): Promise<ActionResult> {
  if (!z.number().int().min(1).max(99).safeParse(quantity).success) {
    return { ok: false, error: "Invalid quantity" };
  }
  try {
    await db.cartItem.update({ where: { id: itemId }, data: { quantity } });
  } catch {
    return { ok: false, error: "Cart item not found" };
  }
  updateTag("cart");
  return { ok: true, data: undefined };
}

export async function removeCartItem(itemId: string): Promise<ActionResult> {
  try {
    await db.cartItem.delete({ where: { id: itemId } });
  } catch {
    return { ok: false, error: "Cart item not found" };
  }
  updateTag("cart");
  return { ok: true, data: undefined };
}

/* ------------------------------------------------------------------ */
/* Wishlist                                                             */
/* ------------------------------------------------------------------ */

export async function toggleWishlist(productSlug: string): Promise<ActionResult<{ added: boolean }>> {
  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, error: "Please sign in to save items" };

  try {
    const product = await db.product.findUnique({ where: { slug: productSlug } });
    if (!product) return { ok: false, error: "Product not found" };

    const wishlist = await db.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    const existing = await db.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId: product.id },
    });
    if (existing) {
      await db.wishlistItem.delete({ where: { id: existing.id } });
    } else {
      await db.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId: product.id },
      });
    }
    updateTag("wishlist");
    return { ok: true, data: { added: !existing } };
  } catch (e) {
    console.error("toggleWishlist", e);
    return { ok: false, error: "Could not update wishlist" };
  }
}

export async function removeWishlistItem(itemId: string): Promise<ActionResult> {
  try {
    await db.wishlistItem.delete({ where: { id: itemId } });
  } catch {
    return { ok: false, error: "Wishlist item not found" };
  }
  updateTag("wishlist");
  revalidatePath("/wishlist");
  return { ok: true, data: undefined };
}

/* ------------------------------------------------------------------ */
/* Custom Order (PRD §5.5)                                              */
/* ------------------------------------------------------------------ */

export async function submitCustomOrder(input: CustomOrderInput): Promise<ActionResult<{ id: string }>> {
  const parsed = customOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields",
      fieldErrors: zodError(parsed.error),
    };
  }
  const userId = await getCurrentUserId();
  try {
    const created = await db.customOrder.create({
      data: {
        ...parsed.data,
        budget: parsed.data.budget ?? undefined,
        userId: userId ?? undefined,
      },
    });
    return { ok: true, data: { id: created.id } };
  } catch (e) {
    console.error("submitCustomOrder", e);
    return { ok: false, error: "Could not submit your order. Please try again." };
  }
}

export async function submitCustomOrderFormAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const get = (k: string) => (formData.get(k) as string) ?? "";
  const budgetRaw = get("budget");
  const result = await submitCustomOrder({
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    swingType: get("swingType"),
    size: get("size") || undefined,
    material: get("material") || undefined,
    finish: get("finish") || undefined,
    color: get("color") || undefined,
    budget: budgetRaw ? Number(budgetRaw) : undefined,
    description: get("description"),
    referenceImages: [],
  });
  if (result.ok) return { ok: true, error: undefined };
  return { ok: false, error: result.error, ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}) };
}

/* ------------------------------------------------------------------ */
/* Contact + Newsletter (PRD §5.9)                                      */
/* ------------------------------------------------------------------ */

export async function submitContact(
  input: z.infer<typeof contactSchema>,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please correct the highlighted fields", fieldErrors: zodError(parsed.error) };
  }
  const userId = await getCurrentUserId();
  try {
    await db.contactInquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        product: parsed.data.product || null,
        message: parsed.data.message,
        userId: userId ?? undefined,
      },
    });
  } catch (e) {
    console.error("submitContact", e);
    return { ok: false, error: "Could not send your message. Please try again." };
  }
  return { ok: true, data: undefined };
}

export async function submitContactFormAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const get = (k: string) => (formData.get(k) as string) ?? "";
  const result = await submitContact({
    name: get("name"),
    email: get("email"),
    phone: get("phone") || undefined,
    product: get("product") || undefined,
    message: get("message"),
  });
  if (result.ok) return { ok: true, error: undefined };
  return { ok: false, error: result.error };
}

export async function subscribeNewsletter(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email");
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Enter a valid email" };
  }
  try {
    // Newsletter subscribers live in ContactInquiry with a marker for now.
    await db.contactInquiry.create({
      data: {
        name: "Newsletter subscriber",
        email: parsed.data.email,
        product: "newsletter",
        message: "Newsletter signup",
      },
    });
  } catch (e) {
    console.error("subscribeNewsletter", e);
    return { ok: false, error: "Could not subscribe. Please try again." };
  }
  return { ok: true, error: undefined };
}