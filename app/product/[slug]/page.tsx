import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, RotateCcw, CreditCard, Star } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { formatINR } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { product as structuredProduct } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.category.slug);

  const schema = structuredProduct(
    product,
    `${siteConfig.url}/product/${product.slug}`,
  );

  const trust = [
    { icon: Truck, label: "Free delivery across India", sub: "7–14 working days" },
    { icon: ShieldCheck, label: "5-year structural warranty", sub: product.warranty ?? "" },
    { icon: RotateCcw, label: "Easy returns", sub: "Damaged-in-transit protection" },
    { icon: CreditCard, label: "Secure payments", sub: "UPI · Cards · Net Banking · COD" },
  ] as const;

  return (
    <div className="bg-ivory">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-line bg-cream">
        <Container className="flex items-center gap-1.5 py-3 text-sm text-muted">
          <Link href="/" className="hover:text-wood-deep">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href="/shop" className="hover:text-wood-deep">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link href={`/shop/${product.category.slug}`} className="hover:text-wood-deep">
            {product.category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span className="text-ink">{product.name}</span>
        </Container>
      </nav>

      <Container className="grid gap-12 py-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="grid grid-cols-[72px_1fr] gap-4">
          <div className="flex flex-col gap-3">
            {product.images.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg border border-line">
                <Image
                  src={src}
                  alt={`${product.name} — view ${i + 1}`}
                  width={72}
                  height={72}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-radius-card bg-cream shadow-card">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            {product.isBestseller && (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-wood-deep">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="eyebrow text-wood">{product.category.name} · {product.material}</p>
            <h1 className="font-display text-display-sm mt-3 text-ink">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-gold" : "opacity-30"}`}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-sm text-muted">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-wood-deep">{formatINR(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatINR(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-gold/20 px-2.5 py-1 text-xs font-semibold text-wood-deep">
                  Save {formatINR(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
            {product.stock <= 0 && (
              <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-medium text-ink">
                Sold out — being handcrafted
              </span>
            )}
          </div>

          <p className="text-base leading-7 text-muted">{product.shortDescription}</p>

          {product.sizes.length > 0 && (
            <div>
              <p className="eyebrow mb-2 text-wood">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink transition-colors hover:border-wood hover:text-wood-deep"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AddToCartButton
            productSlug={product.slug}
            stock={product.stock}
            price={product.price}
          />

          {/* Trust strip */}
          <div className="grid grid-cols-2 gap-4 border-t border-line pt-6">
            {trust.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-wood" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-ink">{label}</p>
                  {sub && <p className="text-xs text-muted">{sub}</p>}
                </div>
              </div>
            ))}
          </div>

          <a
            href={`${siteConfig.contact.whatsappHref}?text=${encodeURIComponent(
              `Hello! I'm interested in "${product.name}" (${siteConfig.url}/product/${product.slug}). Please share details.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#25D366] px-6 text-sm font-medium text-[#128C7E] transition-colors hover:bg-[#25D366]/10"
          >
            Ask on WhatsApp
          </a>
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line bg-cream py-16">
          <Container className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink sm:text-3xl">You may also love</h2>
              <Link href="/shop" className="text-sm font-medium text-wood-deep hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}